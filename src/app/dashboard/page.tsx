"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { STATES, CATEGORIES } from "@/lib/constants";

interface Stats {
  searches: number;
  results: number;
  saved: number;
  notes: number;
}

interface RecentSearch {
  id: string;
  query: string;
  jurisdiction: string;
  category: string | null;
  resultsCount: number | null;
  createdAt: string;
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-navy-100 shadow-sm hover:shadow-md transition animate-fade-in`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-navy-900">{value}</p>
      <p className="text-sm text-navy-500 mt-1">{label}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-navy-100">
      <div className="skeleton w-12 h-12 rounded-xl mb-4" />
      <div className="skeleton w-16 h-8 mb-2" />
      <div className="skeleton w-24 h-4" />
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRecentSearches(d.recentSearches || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Dashboard</h1>
        <p className="text-navy-500 mt-1">Overview of your legal research activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : stats ? (
          <>
            <StatCard icon="🔍" label="Total Searches" value={stats.searches} color="bg-blue-50" />
            <StatCard icon="📄" label="Results Found" value={stats.results} color="bg-green-50" />
            <StatCard icon="⭐" label="Saved Items" value={stats.saved} color="bg-gold-50" />
            <StatCard icon="📝" label="Research Notes" value={stats.notes} color="bg-purple-50" />
          </>
        ) : null}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/search"
              className="flex items-center gap-3 p-4 bg-gold-50 rounded-xl hover:bg-gold-100 transition border border-gold-200"
            >
              <span className="text-2xl">🔍</span>
              <div>
                <p className="font-semibold text-navy-900">New Legal Search</p>
                <p className="text-sm text-navy-500">Search federal & state laws</p>
              </div>
            </Link>
            <Link
              href="/dashboard/notes"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition border border-blue-200"
            >
              <span className="text-2xl">📝</span>
              <div>
                <p className="font-semibold text-navy-900">Create Note</p>
                <p className="text-sm text-navy-500">Document your research</p>
              </div>
            </Link>
            <Link
              href="/dashboard/saved"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition border border-purple-200"
            >
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-semibold text-navy-900">View Saved</p>
                <p className="text-sm text-navy-500">Access your case library</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-navy-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy-900">Recent Searches</h2>
            <Link href="/dashboard/history" className="text-sm text-gold-600 hover:text-gold-700 font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-navy-100">
                  <div className="skeleton w-3/4 h-5 mb-2" />
                  <div className="skeleton w-1/2 h-4" />
                </div>
              ))}
            </div>
          ) : recentSearches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="text-lg font-semibold text-navy-700">No searches yet</h3>
              <p className="text-navy-400 mt-1 mb-4">Start your first legal research</p>
              <Link
                href="/dashboard/search"
                className="px-6 py-2 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-navy-800 transition"
              >
                Search Now
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSearches.map((search, idx) => (
                <Link
                  key={search.id}
                  href={`/dashboard/history/${search.id}`}
                  className="block p-4 rounded-xl border border-navy-100 hover:bg-navy-50 hover:border-navy-200 transition animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-900 truncate">{search.query}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-700">
                          📍 {STATES[search.jurisdiction] || search.jurisdiction}
                        </span>
                        {search.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-700">
                            {CATEGORIES[search.category] || search.category}
                          </span>
                        )}
                        <span className="text-xs text-navy-400">
                          {search.resultsCount || 0} results
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-navy-400 ml-2 whitespace-nowrap">
                      {new Date(search.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">🏛️ Comprehensive U.S. Legal Coverage</h3>
            <p className="text-navy-300 leading-relaxed">
              LegalLens scrapes multiple legal databases including Google Scholar, CourtListener,
              Cornell Law Institute, and Justia to provide comprehensive results across all 50 states
              and federal jurisdictions. Search court cases, statutes, regulations, and legal opinions.
            </p>
          </div>
          <Link
            href="/dashboard/search"
            className="px-6 py-3 bg-gold-500 text-navy-900 rounded-xl font-bold hover:bg-gold-400 transition whitespace-nowrap"
          >
            Start Searching
          </Link>
        </div>
      </div>
    </div>
  );
}
