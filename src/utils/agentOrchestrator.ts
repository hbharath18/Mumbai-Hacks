// src/utils/agentOrchestrator.ts

import {
  uploadStatement,
  getTransactions,
  categorizeTransactions,
  getInsights,
  evaluateRewards,
} from "../services/api";

// TypeScript types
export type Transaction = {
  index: number;
  description: string;
  amount: number;
  date: string;
  [key: string]: any;
};

export type CategoryResult = {
  index: number;
  category: string;
};

export type AdviceResult = {
  problems: string[];
  tips: string[];
  action: string;
  explanation: string;
};

export type RewardsResult = any;

export type UploadWorkflowResult = {
  insertedCount?: number;
  categories?: CategoryResult[];
  advice?: AdviceResult;
  rewards?: RewardsResult;
  transactions?: Transaction[];
  error?: string;
};

export async function runUploadWorkflow(
  file: File,
  userId: string
): Promise<UploadWorkflowResult> {
  const result: UploadWorkflowResult = {};
  try {
    // 1) Upload statement
    const uploadRes = await uploadStatement(file, userId);
    result.insertedCount = uploadRes.insertedCount || uploadRes.items?.length || 0;

    // 2) Fetch latest 100 transactions
    const txsRes = await getTransactions(userId);
    const transactions: Transaction[] = Array.isArray(txsRes)
      ? txsRes
      : txsRes.items || [];
    const latestTxs = transactions
      .slice(-100)
      .map((tx, i) => ({
        index: i,
        description: tx.description,
        amount: tx.amount,
        date: tx.date,
        ...tx,
      }));
    result.transactions = latestTxs;

    // 3) Prepare items for categorization
    const items = latestTxs.map((tx) => ({
      index: tx.index,
      description: tx.description,
      amount: tx.amount,
      date: tx.date,
    }));

    // 4) Categorize transactions
    let categories: CategoryResult[] = [];
    try {
      const catRes = await categorizeTransactions(items);
      categories = Array.isArray(catRes) ? catRes : catRes.categories || [];
      result.categories = categories;
      // 5) Merge categories locally
      for (const cat of categories) {
        const tx = latestTxs.find((t) => t.index === cat.index);
        if (tx) tx.category = cat.category;
      }
      result.transactions = latestTxs;
    } catch (catErr: any) {
      result.error = `Categorization error: ${catErr.message || catErr}`;
    }

    // 6) Get insights and evaluate rewards in parallel
    const [advice, rewards] = await Promise.all([
      getInsights(userId).catch((err) => {
        result.error = `Insights error: ${err.message || err}`;
        return undefined;
      }),
      evaluateRewards({ userId }).catch((err) => {
        result.error = `Rewards error: ${err.message || err}`;
        return undefined;
      }),
    ]);
    if (advice) result.advice = advice;
    if (rewards) result.rewards = rewards;
  } catch (err: any) {
    result.error = err.message || "Workflow failed";
  }
  return result;
}
