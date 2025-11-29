// src/pages/Dashboard.tsx

import React, { useEffect, useState } from "react";
import {
  getTransactions,
  getInsights,
  categorizeTransactions,
} from "../services/api";

type Transaction = {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
};

type Insights = {
  problems: string[];
  tips: string[];
  action: string;
  explanation: string;
};

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [errorTx, setErrorTx] = useState<string | null>(null);

  const [insights, setInsights] = useState<Insights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [errorInsights, setErrorInsights] = useState<string | null>(null);

  const [loadingCat, setLoadingCat] = useState(false);
  const [errorCat, setErrorCat] = useState<string | null>(null);

  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    async function fetchTx() {
      setLoadingTx(true);
      setErrorTx(null);
      try {
        const txs = await getTransactions(userId);
        setTransactions(Array.isArray(txs) ? txs : txs.transactions || []);
      } catch (err: any) {
        setErrorTx(err.message || "Failed to fetch transactions.");
      } finally {
        setLoadingTx(false);
      }
    }
    if (userId) fetchTx();
  }, [userId]);

  const totalExpenses = transactions.reduce(
    (sum, tx) => sum + (tx.amount < 0 ? -tx.amount : tx.amount),
    0
  );

  const latestTxs = transactions
    .slice()
    .sort((a, b) => (b.date > a.date ? 1 : -1))
    .slice(0, 10);

  const handleAnalyze = async () => {
    setLoadingInsights(true);
    setErrorInsights(null);
    setInsights(null);
    try {
      const res = await getInsights(userId);
      setInsights(res);
    } catch (err: any) {
      setErrorInsights(err.message || "Failed to analyze spending.");
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleCategorize = async () => {
    setLoadingCat(true);
    setErrorCat(null);
    try {
      const items = transactions
        .slice(0, 50)
        .map((tx, idx) => ({
          index: idx,
          description: tx.description,
          amount: tx.amount,
        }));
      const res = await categorizeTransactions(items as any);
      const cats = Array.isArray(res)
        ? res
        : res.categories && Array.isArray(res.categories)
        ? res.categories
        : res;
      if (cats && Array.isArray(cats)) {
        setTransactions((prev) =>
          prev.map((tx, idx) => ({ ...tx, category: cats[idx] || tx.category }))
        );
      }
    } catch (err: any) {
      setErrorCat(err.message || "Failed to categorize transactions.");
    } finally {
      setLoadingCat(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-lg font-semibold">Total Expenses:</span>{" "}
          <span className="text-primary font-bold">₹{totalExpenses.toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
            onClick={handleAnalyze}
            disabled={loadingInsights || loadingTx}
          >
            {loadingInsights ? "Analyzing..." : "Analyze My Spending"}
          </button>
          <button
            className="bg-muted text-primary px-3 py-2 rounded border border-primary hover:bg-primary/10 text-sm disabled:opacity-50"
            onClick={handleCategorize}
            disabled={loadingCat || loadingTx}
          >
            {loadingCat ? "Categorizing..." : "Auto Categorize Recent"}
          </button>
        </div>
      </div>

      {errorTx && <div className="text-red-600 mb-4">{errorTx}</div>}

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Latest Transactions</h2>
        {loadingTx ? (
          <div>Loading transactions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">Date</th>
                  <th className="px-2 py-1 text-left">Description</th>
                  <th className="px-2 py-1 text-right">Amount</th>
                  <th className="px-2 py-1 text-left">Category</th>
                </tr>
              </thead>
              <tbody>
                {latestTxs.map((tx) => (
                  <tr key={tx._id} className="border-t">
                    <td className="px-2 py-1">{tx.date?.slice(0, 10)}</td>
                    <td className="px-2 py-1">{tx.description}</td>
                    <td className="px-2 py-1 text-right">{tx.amount.toFixed(2)}</td>
                    <td className="px-2 py-1">{tx.category || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Insights</h2>
        {loadingInsights ? (
          <div>Analyzing...</div>
        ) : errorInsights ? (
          <div className="text-red-600">{errorInsights}</div>
        ) : insights ? (
          <div className="border rounded p-4 bg-gray-50">
            <div className="mb-2">
              <strong>Problems:</strong>
              <ul className="list-disc list-inside">
                {insights.problems.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <strong>Tips:</strong>
              <ul className="list-disc list-inside">
                {insights.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="mb-2">
              <strong>Action:</strong>
              <div>{insights.action}</div>
            </div>
            <div>
              <strong>Explanation:</strong>
              <div>{insights.explanation}</div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No insights yet. Click Analyze to generate insights.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;