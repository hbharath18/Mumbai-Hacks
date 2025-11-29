// backend/routes/ai.js
import express from "express";
import Transaction from "../models/Transaction.js";
import {
  categorizeWithAI,
  generateInsights,
  festivalSavingsPlan,
  isAIEnabled
} from "../utils/aiClient.js";

const router = express.Router();

/**
 * POST /api/ai/categorize
 * Body either:
 *  - { items: [{ index, description, amount, date }, ...] }
 *  - { userId, limit }  (will fetch the user's latest `limit` transactions and categorize them)
 *
 * Response:
 *  { categories: [{ index, category }, ...], source: "ai"|"rules" }
 */
router.post("/categorize", async (req, res) => {
  try {
    const { items, userId, limit = 50 } = req.body;

    let toCategorize = [];

    if (Array.isArray(items) && items.length > 0) {
      // normalize items (ensure index exists)
      toCategorize = items.map((it, i) => ({ index: (it.index ?? i), description: it.description ?? "", amount: it.amount ?? 0, date: it.date ?? null }));
    } else if (userId) {
      // fetch recent transactions for user and map to items
      const txs = await Transaction.find({ userId }).sort({ date: -1 }).limit(Number(limit)).lean();
      toCategorize = txs.map((tx, i) => ({ index: i, description: tx.description || "", amount: tx.amount || 0, date: tx.date }));
    } else {
      return res.status(400).json({ error: "Provide either items array or userId" });
    }

    if (toCategorize.length === 0) {
      return res.json({ categories: [], source: isAIEnabled() ? "ai" : "rules" });
    }

    const categories = await categorizeWithAI(toCategorize);
    return res.json({ categories, source: isAIEnabled() ? "ai" : "rules" });
  } catch (err) {
    console.error("AI /categorize error:", err);
    return res.status(500).json({ error: "Categorize failed", details: err.message });
  }
});

/**
 * POST /api/ai/insights
 * Body:
 *  { userId, from, to, sampleLimit }
 *
 * Response:
 *  { advice: { problems, tips, action, explanation }, summary: {category:value,...}, totalExpense }
 */
router.post("/insights", async (req, res) => {
  try {
    const { userId, from, to, sampleLimit = 500 } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const q = { userId };
    if (from || to) q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);

    // fetch transactions in range
    const txs = await Transaction.find(q).limit(Number(sampleLimit)).lean();

    // aggregate expense by category
    const spentByCategory = {};
    let totalExpense = 0;
    for (const tx of txs) {
      if (tx.type === "expense") {
        const cat = tx.category || "Other";
        spentByCategory[cat] = (spentByCategory[cat] || 0) + (tx.amount || 0);
        totalExpense += (tx.amount || 0);
      }
    }

    // optional: compute avgIncome if you store incomes - left as null for now
    const avgIncome = null;

    // call AI helper
    const advice = await generateInsights({ summaryObj: spentByCategory, totalExpense, avgIncome });

    return res.json({ advice, summary: spentByCategory, totalExpense });
  } catch (err) {
    console.error("AI /insights error:", err);
    return res.status(500).json({ error: "Insights failed", details: err.message });
  }
});

/**
 * POST /api/ai/festival
 * Body:
 *  { userId (optional), festivalDate (YYYY-MM-DD), startDate (YYYY-MM-DD optional), incomes: [..] (optional), desiredBudget (number) }
 *
 * Response:
 *  { plan: { weeks: [...], categorySuggestions: {...}, totalTarget } }
 *
 * If userId is provided, you could compute incomes from stored transactions in future; currently incomes can be passed directly.
 */
router.post("/festival", async (req, res) => {
  try {
    const { userId, festivalDate, startDate, incomes = [], desiredBudget = 0 } = req.body;
    if (!festivalDate) return res.status(400).json({ error: "festivalDate required (YYYY-MM-DD)" });

    // If userId provided and incomes empty you could infer incomes from db (not implemented here)
    const plan = await festivalSavingsPlan({ festivalDate, startDate, incomes, desiredBudget: Number(desiredBudget) });

    return res.json({ plan });
  } catch (err) {
    console.error("AI /festival error:", err);
    return res.status(500).json({ error: "Festival plan failed", details: err.message });
  }
});

/**
 * POST /api/ai/event
 * Body:
 *  { eventName, attendeesCount, desiredBudget, priorities: ["Food","Venue","Gifts", ...] }
 *
 * Response:
 *  { budget: { category: amount, ... }, notes: "..." }
 *
 * This is a lightweight planner that splits budget across priorities.
 * For advanced planning we could ask the LLM using festivalSavingsPlan-like flow.
 */
router.post("/event", async (req, res) => {
  try {
    const { eventName = "Event", attendeesCount = 1, desiredBudget = 0, priorities = ["Food", "Venue", "Gifts", "Misc"] } = req.body;
    const budget = {};
    // default allocation: Food 40%, Venue 30%, Gifts 20%, Misc 10% (adjust if priorities different)
    const defaultAlloc = { Food: 0.4, Venue: 0.3, Gifts: 0.2, Misc: 0.1 };

    // If priorities provided, try to allocate proportionally based on defaultAlloc or evenly
    let remaining = Number(desiredBudget);
    for (const p of priorities) {
      const pct = defaultAlloc[p] ?? (1 / priorities.length);
      const amt = Math.round(Number(desiredBudget) * pct);
      budget[p] = amt;
      remaining -= amt;
    }
    // attach remaining to Misc or last priority
    const lastKey = priorities[priorities.length - 1] || "Misc";
    budget[lastKey] = (budget[lastKey] || 0) + remaining;

    const notes = `Estimated split for ${eventName} for ${attendeesCount} attendees. Adjust based on local prices.`;
    return res.json({ budget, notes });
  } catch (err) {
    console.error("AI /event error:", err);
    return res.status(500).json({ error: "Event planning failed", details: err.message });
  }
});

export default router;
