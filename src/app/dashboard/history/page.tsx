"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { STATES, CATEGORIES } from "@/lib/constants";

interface Search {
  id: string;
  query: string;
  jurisdiction: string;
  category: string | null;
  resultsCount: number | null;
  createdAt: string;
}

export default function HistoryPage() {
  const [searchList, setSearchList] = useState<Search[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((d) => setSearchList(d.searches || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this search and all its results?")) return;
    setDeletingId(id);
    // Optimistic update
    setSearchList((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/search/${id}`, { method: "DELETE" });
    } catch {
      // Revert on error
      fetch("/api/search").then((r) => r.json()).then((d) => setSearchList(d.searches || []));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Search History</h1>
          <p className="text-navy-500 mt-1">View and manage your past legal searches</p>
        </div>
        <Link
          href="/dashboard/search"
          className="px-5 py-2.5 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-navy-800 transition"
        >
          + New Search
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-navy-100">
              <div className="skeleton w-3/4 h-6 mb-3" />
              <div className="flex gap-2">
                <div className="skeleton w-24 h-6 rounded-full" />
                <div className="skeleton w-32 h-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : searchList.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-navy-100 text-center">
          <span className="text-6xl">📜</span>
          <h3 className="text-xl font-bold text-navy-700 mt-4">No search history</h3>
          <p className="text-navy-400 mt-2 mb-6">Your search history will appear here</p>
          <Link
            href="/dashboard/search"
            className="inline-flex px-6 py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition"
          >
            Start Your First Search
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {searchList.map((search, idx) => (
            <div
              key={search.id}
              className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm hover:shadow-md transition animate-fade-in"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <Link href={`/dashboard/history/${search.id}`} className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy-900 text-lg hover:text-gold-600 transition">
                    {search.query}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navy-100 text-navy-700">
                      📍 {STATES[search.jurisdiction] || search.jurisdiction}
                    </span>
                    {search.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700">
                        {CATEGORIES[search.category] || search.category}
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      📄 {search.resultsCount || 0} results
                    </span>
                    <span className="text-xs text-navy-400">
                      {new Date(search.createdAt).toLocaleString()}
                    </span>
                  </div>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/dashboard/history/${search.id}`}
                    className="px-4 py-2 bg-navy-50 text-navy-700 rounded-xl text-sm font-medium hover:bg-navy-100 transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(search.id)}
                    disabled={deletingId === search.id}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
