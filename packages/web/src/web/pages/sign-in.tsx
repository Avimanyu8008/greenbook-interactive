import { useState } from "react";
import { useLocation } from "wouter";
import { authClient } from "../lib/auth";
import { syncProgressFromServer } from "../lib/progress-sync";
import { BookOpen, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";

type Tab = "signin" | "signup";

export default function SignInPage() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "signup") {
        const { error } = await authClient.signUp.email({ name, email, password });
        if (error) { setError(error.message ?? "Sign up failed"); return; }
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) { setError(error.message ?? "Sign in failed"); return; }
      }
      // Merge server progress into local after sign in
      await syncProgressFromServer();
      navigate("/problems");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #f9faf7 0%, #e8f4eb 60%, #f9faf7 100%)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3"
            style={{ background: "var(--accent)", fontFamily: "DM Serif Display, serif" }}
          >
            G
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "DM Serif Display, serif", color: "var(--text)" }}
          >
            GreenBook
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Quant interview prep with interactive simulations
          </p>
        </div>

        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: "var(--surface-2)" }}
          >
            {(["signin", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                style={{
                  background: tab === t ? "var(--surface)" : "transparent",
                  color: tab === t ? "var(--accent)" : "var(--text-muted)",
                  boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jane Street"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all pr-10"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="text-sm px-3.5 py-2.5 rounded-xl"
                style={{ background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-1"
              style={{ background: "var(--accent)" }}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  {tab === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {tab === "signin" && (
            <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
              No account?{" "}
              <button
                onClick={() => setTab("signup")}
                className="font-medium"
                style={{ color: "var(--accent)" }}
              >
                Sign up free
              </button>
            </p>
          )}
        </div>

        <div
          className="mt-4 flex items-center justify-center gap-2 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <Zap size={11} />
          Progress synced across all your devices when signed in
        </div>
      </div>
    </div>
  );
}
