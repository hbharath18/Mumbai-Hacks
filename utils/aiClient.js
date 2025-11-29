// backend/utils/aiClient.js
// AI helper: uses OpenAI if OPENAI_API_KEY is present, otherwise falls back to rule-based behavior.
// Drop-in ready for ESM projects (type: module)

import OpenAI from "openai";

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

/**
 * Create OpenAI client or null if key missing.
 */
function createClient() {
  if (!OPENAI_KEY) return null;
  return new OpenAI({ apiKey: OPENAI_KEY });
}

const client = createClient();

/* -------------------------
   Utilities / fallbacks
   ------------------------- */
function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    // attempt to extract JSON substring
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch (_) {}
    }
    return null;
  }
}

function simpleRuleCategory(description = "") {
  const s = (description || "").toLowerCase();
  if (/swiggy|zomato|restaurant|dine|dominos|ubereats/.test(s)) return "Food";
  if (/uber|ola|taxi|cab|rail|bus|flight/.test(s)) return "Travel";
  if (/amazon|myntra|flipkart|shopping|shop|store/.test(s)) return "Shopping";
  if (/rent|rental/.test(s)) return "Rent";
  if (/bill|electric|water|phone|internet|postpaid|dth/.test(s)) return "Bills";
  if (/pharmacy|hospital|clinic|medic|doctor/.test(s)) return "Medical";
  if (/movie|cinema|ticket|netflix|prime|hotstar/.test(s)) return "Entertainment";
  return "Other";
}

/* -------------------------
   categorizeWithAI(items)
   items: [{ index, description, amount, date }]
   returns: [{ index, category }]
   ------------------------- */
export async function categorizeWithAI(items = [], opts = {}) {
  // small guard
  if (!Array.isArray(items) || items.length === 0) return [];

  // If no OpenAI key, use rule-based fallback
  if (!client) {
    return items.map(it => ({ index: it.index, category: simpleRuleCategory(it.description) }));
  }

  // Limit batch size to keep token cost reasonable
  const batch = items.slice(0, 100); // safe upper bound; adjust as needed
  const system = `You are a transaction categorizer for Indian users. Respond ONLY with JSON array of objects of shape [{ "index": <number>, "category": "<one-of>"}].
Allowed categories: ["Food","Travel","Shopping","Rent","Bills","Entertainment","Medical","Other"].
Do NOT add any explanatory text.`;

  const user = `Categorize these transactions:\n\n${JSON.stringify(batch, null, 2)}`;

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",            // change model if you prefer
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 800,
      temperature: 0
    });

    const text = resp?.choices?.[0]?.message?.content ?? "";
    const parsed = safeParseJson(text);
    if (Array.isArray(parsed)) return parsed.map(p => ({ index: p.index, category: p.category }));
    // fallback: return rule-based
    return batch.map(it => ({ index: it.index, category: simpleRuleCategory(it.description) }));
  } catch (err) {
    console.error("categorizeWithAI error:", err?.message || err);
    // fallback to rule-based
    return items.map(it => ({ index: it.index, category: simpleRuleCategory(it.description) }));
  }
}

/* -------------------------
   generateInsights({summaryObj, totalExpense, avgIncome})
   summaryObj: { Food: 3500, Travel: 2500, ... }
   returns: { problems:[], tips:[], action:"", explanation:"" }
   ------------------------- */
export async function generateInsights({ summaryObj = {}, totalExpense = 0, avgIncome = null } = {}) {
  // Fallback rule-based simple insights if no OpenAI or on error
  const fallback = () => {
    // pick top 3 categories by amount
    const entries = Object.entries(summaryObj || {});
    entries.sort((a, b) => b[1] - a[1]);
    const problems = entries.slice(0, 3).map(e => e[0]);
    const tips = [
      "Set a weekly spending cap for the top category.",
      "Replace 2 paid food orders with home-cooked meals this week.",
      "Move 10% of savings into a separate account at paycheck time."
    ];
    const action = "Uninstall or sign out of food delivery apps for 48 hours to reduce impulse orders.";
    const explanation = `Top spends are ${problems.join(", ")}, which are large contributors to monthly expense. Small behavioral changes can free up cash quickly.`;
    return { problems, tips, action, explanation };
  };

  if (!client) return fallback();

  const system = `You are a helpful Indian personal finance coach. Respond ONLY with JSON in this exact shape:
{
  "problems": ["category1","category2","category3"],
  "tips": ["tip1","tip2","tip3"],
  "action": "one short immediate action",
  "explanation": "one-sentence summary"
}`;
  const user = `User spending summary: ${JSON.stringify(summaryObj)}.
TotalExpense: ${totalExpense}.
AverageIncome: ${avgIncome || "unknown"}.
Return problems (top 3), three practical tips, one immediate micro-action, and a one-sentence explanation.`;

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 400,
      temperature: 0.2
    });

    const text = resp?.choices?.[0]?.message?.content ?? "";
    const parsed = safeParseJson(text);
    if (parsed && parsed.problems) return parsed;
    // if parse failed, try to heuristically extract JSON
    return fallback();
  } catch (err) {
    console.error("generateInsights error:", err?.message || err);
    return fallback();
  }
}

/* -------------------------
   festivalSavingsPlan(params)
   params: { festivalDate: "YYYY-MM-DD", startDate: "YYYY-MM-DD", incomes: [..], desiredBudget }
   returns: { weeks: [{weekStart, targetSave, notes}], categorySuggestions: {...}, totalTarget }
   ------------------------- */
export async function festivalSavingsPlan({ festivalDate, startDate, incomes = [], desiredBudget = 0 } = {}) {
  const fallback = () => {
    // simple weekly split between startDate and festivalDate
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(festivalDate);
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeks = Math.max(1, Math.ceil((end - start) / msPerWeek));
    const weekly = Math.ceil(desiredBudget / weeks);
    const weekArr = [];
    for (let i = 0; i < weeks; i++) {
      const wkStart = new Date(start.getTime() + i * msPerWeek);
      weekArr.push({
        weekStart: wkStart.toISOString().slice(0, 10),
        targetSave: weekly,
        notes: "Flexible target; if income arrives increase this week's target."
      });
    }
    return { weeks: weekArr, categorySuggestions: { Gifts: Math.round(desiredBudget * 0.4), Food: Math.round(desiredBudget * 0.4), Misc: Math.round(desiredBudget * 0.2) }, totalTarget: desiredBudget };
  };

  if (!client) return fallback();

  const system = `You are a savings planner for users with irregular income. Respond ONLY with JSON:
{
  "weeks": [ {"weekStart":"YYYY-MM-DD","targetSave":number, "notes":"..."}, ... ],
  "categorySuggestions": {"Gifts":number,"Food":number,"Misc":number},
  "totalTarget": number
}`;
  const incomesStr = incomes.length ? `Incomes: ${JSON.stringify(incomes)}` : "";
  const user = `Festival date: ${festivalDate}. Start date: ${startDate || new Date().toISOString().slice(0,10)}. ${incomesStr}. Desired festival budget: ${desiredBudget}. Provide a weekly savings plan until the festival.`;

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_tokens: 800,
      temperature: 0.2
    });

    const text = resp?.choices?.[0]?.message?.content ?? "";
    const parsed = safeParseJson(text);
    if (parsed && parsed.weeks) return parsed;
    return fallback();
  } catch (err) {
    console.error("festivalSavingsPlan error:", err?.message || err);
    return fallback();
  }
}

/* -------------------------
   Export a convenience function to detect if OpenAI is enabled
   ------------------------- */
export function isAIEnabled() {
  return !!client;
}
