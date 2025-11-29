import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      if (email === "demo@example.com") {
        localStorage.setItem("userEmail", "demo@example.com");
        localStorage.setItem("userId", "692a049c2f1b09b1da1b972c");
      } else {
        const guestId = `guest-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userId", guestId);
      }
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 bg-card border border-border/40">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sign in</h1>
          <p className="text-muted">Welcome to FinWise AI</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-muted">
            Demo account: <span className="font-medium">demo@example.com</span>
          </p>
        </form>
      </Card>
    </div>
  );
}
