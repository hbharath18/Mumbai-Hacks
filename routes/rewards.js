// backend/routes/rewards.js
import express from "express";
import Transaction from "../models/Transaction.js";
import CouponMaster from "../models/CouponMaster.js";
import UserCoupon from "../models/UserCoupon.js";

const router = express.Router();

/**
 * POST /api/rewards/evaluate
 * Body:
 *  {
 *    userId: <string>,
 *    month: <0-11> optional (JS month index) OR 1-12 accepted,
 *    year: <YYYY> optional,
 *    monthlyBudget: <number> optional
 *  }
 *
 * Behaviour:
 *  - Computes total expense for given month (defaults to current month if not provided)
 *  - If monthlyBudget provided, compares spending ratio to decide tier
 *  - Selects an appropriate coupon from CouponMaster based on tier and creates a UserCoupon
 *  - Avoids creating duplicate active coupon entries for same coupon/user
 *
 * Response:
 *  { eligible: boolean, tier: "gold"|"silver"|"bronze"|null, coupon: {...} }
 */
router.post("/evaluate", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    // month/year handling (supports both 1-12 and 0-11)
    let { month, year, monthlyBudget } = req.body;
    const now = new Date();
    if (!year) year = now.getFullYear();
    if (typeof month === "string") month = parseInt(month, 10);
    if (typeof month !== "number" || Number.isNaN(month)) {
      month = now.getMonth(); // 0-11
    } else {
      // if user gave 1-12, convert to 0-11
      if (month >= 1 && month <= 12) month = month - 1;
    }

    const start = new Date(year, month, 1, 0, 0, 0);
    const end = new Date(year, month + 1, 0, 23, 59, 59);

    // fetch expense transactions for the month
    const txs = await Transaction.find({
      userId,
      type: "expense",
      date: { $gte: start, $lte: end }
    }).lean();

    const totalExpense = txs.reduce((s, t) => s + (t.amount || 0), 0);

    // If no budget provided, try to estimate from recent incomes if available
    if (!monthlyBudget) {
      // quick heuristic: sum last 3 incomes and take avg if exists
      const incomes = await Transaction.find({ userId, type: "income" }).sort({ date: -1 }).limit(12).lean();
      if (incomes && incomes.length) {
        const lastThree = incomes.slice(0, 3).map(i => i.amount || 0);
        const avg = Math.round(lastThree.reduce((a,b) => a+b,0) / Math.max(1, lastThree.length));
        monthlyBudget = avg || null;
      }
    }

    // decide tier: better performance (lower ratio) => higher tier
    // If we don't have monthlyBudget, use static thresholds on absolute spending
    let tier = null;
    if (monthlyBudget) {
      const ratio = totalExpense / monthlyBudget; // lower is better
      if (ratio <= 0.5) tier = "gold";
      else if (ratio <= 0.65) tier = "silver";
      else if (ratio <= 0.85) tier = "bronze";
    } else {
      // fallback absolute thresholds (customize as needed)
      if (totalExpense <= 5000) tier = "gold";
      else if (totalExpense <= 15000) tier = "silver";
      else if (totalExpense <= 30000) tier = "bronze";
    }

    if (!tier) {
      return res.json({ eligible: false, reason: "Not within reward thresholds", totalExpense, monthlyBudget });
    }

    // Find a matching coupon in CouponMaster by category matching tier (we used category field earlier)
    // Prefer unused coupons (not strictly necessary — we assume CouponMaster is catalog)
    const coupon = await CouponMaster.findOne({ category: tier }).lean();
    if (!coupon) {
      return res.json({ eligible: true, tier, message: "Qualified but no coupon configured for this tier", totalExpense, monthlyBudget });
    }

    // Check if user already has an active copy of this coupon (avoid duplicates)
    const existing = await UserCoupon.findOne({
      userId,
      couponId: coupon._id,
      status: "active"
    });

    if (existing) {
      return res.json({
        eligible: true,
        tier,
        coupon: {
          code: coupon.code,
          title: coupon.title,
          description: coupon.description,
          expiresAt: existing.expiresAt
        },
        message: "Coupon already unlocked and active"
      });
    }

    // create user coupon with expiry based on coupon.expiryDays
    const nowDate = new Date();
    const expiresAt = new Date(nowDate.getTime() + (coupon.expiryDays || 30) * 24 * 60 * 60 * 1000);

    const userCoupon = await UserCoupon.create({
      userId,
      couponId: coupon._id,
      unlockedAt: nowDate,
      expiresAt,
      status: "active"
    });

    return res.json({
      eligible: true,
      tier,
      coupon: {
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        valueType: coupon.valueType,
        value: coupon.value,
        minSpend: coupon.minSpend,
        expiresAt
      },
      userCouponId: userCoupon._id,
      totalExpense,
      monthlyBudget
    });
  } catch (err) {
    console.error("Rewards evaluate error:", err);
    return res.status(500).json({ error: "Rewards evaluate failed", details: err.message });
  }
});

/**
 * GET /api/rewards/user/:userId
 * Lists active user coupons for a user
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = (req.params.userId || "").toString().trim();
    const rows = await UserCoupon.find({ userId }).populate("couponId").sort({ unlockedAt: -1 }).lean();
    const mapped = rows.map(r => ({
      id: r._id,
      coupon: r.couponId,
      status: r.status,
      unlockedAt: r.unlockedAt,
      expiresAt: r.expiresAt
    }));
    return res.json(mapped);
  } catch (err) {
    console.error("Rewards user list error:", err);
    return res.status(500).json({ error: "List failed", details: err.message });
  }
});

/**
 * POST /api/rewards/redeem
 * Body: { userId, userCouponId }
 * Marks coupon as used (basic flow)
 */
router.post("/redeem", async (req, res) => {
  try {
    const { userId, userCouponId } = req.body;
    if (!userId || !userCouponId) return res.status(400).json({ error: "userId and userCouponId required" });

    const uc = await UserCoupon.findOne({ _id: userCouponId, userId });
    if (!uc) return res.status(404).json({ error: "UserCoupon not found" });
    if (uc.status !== "active") return res.status(400).json({ error: "Coupon not active" });

    uc.status = "used";
    await uc.save();

    return res.json({ ok: true, msg: "Coupon marked as used", userCouponId });
  } catch (err) {
    console.error("Rewards redeem error:", err);
    return res.status(500).json({ error: "Redeem failed", details: err.message });
  }
});

export default router;
