// src/services/api.ts

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "API error");
  }
  return data;
}

export async function uploadStatement(file: File, userId: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  const res = await fetch(`${BASE}/api/transactions/import-statement`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function getTransactions(userId: string) {
  const res = await fetch(`${BASE}/api/transactions/${userId}`);
  return handleResponse(res);
}

export async function getInsights(userId: string, from?: string, to?: string) {
  const body = { userId, from, to };
  const res = await fetch(`${BASE}/api/ai/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function categorizeTransactions(items: Array<{ index: number; description: string; amount: number }>) {
  const res = await fetch(`${BASE}/api/ai/categorize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  return handleResponse(res);
}

export async function evaluateRewards(body: any) {
  const res = await fetch(`${BASE}/api/rewards/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function getUserCoupons(userId: string) {
  const res = await fetch(`${BASE}/api/rewards/user/${userId}`);
  return handleResponse(res);
}

export async function redeemCoupon(userId: string, userCouponId: string) {
  const res = await fetch(`${BASE}/api/rewards/redeem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, userCouponId }),
  });
  return handleResponse(res);
}
