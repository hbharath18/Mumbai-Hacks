// backend/routes/transactions.js
import express from "express";
import Transaction from "../models/Transaction.js"; // ensure this file exists
const router = express.Router();

// ... keep your ping/test routes above ...

router.get("/:userId", async (req, res) => {
  try {
    // defensive: decode and trim userId from URL
    let userId = (req.params.userId || "").toString();
    userId = decodeURIComponent(userId).trim();

    const { from, to } = req.query;
    const q = { userId };
    if (from || to) q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);

    console.log("Fetching transactions for userId:", JSON.stringify(userId));
    const txs = await Transaction.find(q).sort({ date: -1 });
    return res.json(txs);
  } catch (err) {
    console.error("Fetch transactions failed:", err);
    return res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

export default router;
