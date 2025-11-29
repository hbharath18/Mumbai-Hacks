export function getCurrentUser(): { userId: string; email: string } | null {
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("userEmail");

  if (!userId || !email) {
    return null;
  }

  return { userId, email };
}

export function logout(): void {
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");
  window.location.href = "/signin";
}
