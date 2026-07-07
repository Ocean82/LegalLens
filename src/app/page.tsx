"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) router.replace("/dashboard");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  useEffect(() => {
    // Seed on first load
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" ? { email, password } : { email, password, name };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An error occurred");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setSeeding(true);
    setError("");
    // Ensure seed is done
    await fetch("/api/seed", { method: "POST" }).catch(() => {});
    setEmail("demo@legallens.com");
    setPassword("demo1234");
    setMode("login");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@legallens.com", password: "demo1234" }),
      });
      const data = await res.json();
      if (res.ok) {
        router.replace("/dashboard");
      } else {
        setError(data.error || "Demo login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSeeding(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
        <div className="animate-pulse text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
      {/* Left panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚖️</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">LegalLens</h1>
          </div>
          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            U.S. Legal Research<br />
            <span className="text-gold-400">Made Simple</span>
          </h2>
          <p className="text-xl text-navy-300 leading-relaxed mb-10 max-w-lg">
            Search federal and state laws, scrape court cases, and build your legal research library — all in one powerful platform.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: "🔍", label: "Web Scraping", desc: "Multi-source legal search" },
              { icon: "🏛️", label: "50 States + Federal", desc: "Complete U.S. coverage" },
              { icon: "📚", label: "Case Library", desc: "Save & organize results" },
              { icon: "📝", label: "Research Notes", desc: "Built-in note system" },
            ].map((f) => (
              <div key={f.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="text-white font-semibold mt-2">{f.label}</h3>
                <p className="text-navy-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">⚖️</span>
            </div>
            <h1 className="text-3xl font-bold text-white">LegalLens</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-2">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-navy-500 mb-6">
              {mode === "login"
                ? "Sign in to access your legal research"
                : "Start your legal research journey"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition"
                    placeholder="Alex Thompson"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy-900 text-white py-3 rounded-xl font-semibold hover:bg-navy-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-4">
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-navy-100" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-navy-400">or</span>
                </div>
              </div>

              <button
                onClick={handleDemoLogin}
                disabled={seeding}
                className="w-full bg-gold-500 text-navy-900 py-3 rounded-xl font-semibold hover:bg-gold-400 transition disabled:opacity-50"
              >
                {seeding ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />
                    Loading demo...
                  </span>
                ) : "Try Demo Account"}
              </button>
            </div>

            <p className="text-center mt-6 text-sm text-navy-500">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="text-gold-600 font-semibold hover:text-gold-700"
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
