"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/search", label: "Legal Search", icon: "🔍" },
  { href: "/dashboard/history", label: "Search History", icon: "📜" },
  { href: "/dashboard/saved", label: "Saved Results", icon: "⭐" },
  { href: "/dashboard/notes", label: "Research Notes", icon: "📝" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
        else router.replace("/");
      })
      .catch(() => router.replace("/"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-navy-200 border-t-gold-500 rounded-full animate-spin" />
          <p className="text-navy-500 font-medium">Loading LegalLens...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-navy-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-navy-900 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-navy-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">⚖️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LegalLens</h1>
                <p className="text-xs text-navy-400">U.S. Legal Research</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                      : "text-navy-300 hover:text-white hover:bg-navy-800"}`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-navy-700">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 bg-gold-500 rounded-full flex items-center justify-center text-navy-900 font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-navy-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 px-4 py-2 text-sm text-navy-400 hover:text-white hover:bg-navy-800 rounded-xl transition flex items-center gap-2"
            >
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-navy-100 px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-navy-50 rounded-xl transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <span className="font-bold text-navy-900">LegalLens</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
