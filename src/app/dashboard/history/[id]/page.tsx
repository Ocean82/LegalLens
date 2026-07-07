"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { STATES, CATEGORIES } from "@/lib/constants";

interface SearchDetail {
  id: string;
  query: string;
  jurisdiction: string;
  category: string | null;
  resultsCount: number | null;
  createdAt: string;
}

interface Result {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string | null;
  sourceName: string | null;
  jurisdiction: string;
  category: string | null;
  caseNumber: string | null;
  dateFiled: string | null;
  court: string | null;
}

export default function SearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [search, setSearch] = useState<SearchDetail | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/search/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setSearch(d.search);
        setResults(d.results || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (resultId: string) => {
    setSavingId(resultId);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId }),
      });
      if (res.ok) {
        setSavedIds((prev) => new Set(prev).add(resultId));
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="skeleton w-64 h-8 mb-4" />
        <div className="skeleton w-96 h-4 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-navy-100">
              <div className="skeleton w-3/4 h-6 mb-3" />
              <div className="skeleton w-full h-4 mb-2" />
              <div className="skeleton w-2/3 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!search) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <span className="text-5xl">❌</span>
        <h2 className="text-xl font-bold text-navy-700 mt-4">Search not found</h2>
        <Link href="/dashboard/history" className="mt-4 inline-block text-gold-600 hover:text-gold-700 font-medium">
          ← Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/dashboard/history" className="text-sm text-navy-500 hover:text-navy-700 mb-4 inline-flex items-center gap-1">
        ← Back to History
      </Link>

      <div className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-navy-900 mb-2">{search.query}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-navy-100 text-navy-700">
            📍 {STATES[search.jurisdiction] || search.jurisdiction}
          </span>
          {search.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-100 text-gold-700">
              {CATEGORIES[search.category] || search.category}
            </span>
          )}
          <span className="text-sm text-navy-400">
            {new Date(search.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <h2 className="text-lg font-bold text-navy-900 mb-4">
        {results.length} Result{results.length !== 1 ? "s" : ""}
      </h2>

      {results.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-navy-100 text-center">
          <span className="text-5xl">📭</span>
          <h3 className="text-lg font-bold text-navy-700 mt-4">No results for this search</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result, idx) => (
            <div
              key={result.id}
              className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy-900 text-lg">{result.title}</h3>
                  {result.court && <p className="text-sm text-navy-500 mt-1">🏛️ {result.court}</p>}
                  {result.caseNumber && <p className="text-sm text-navy-400">Case: {result.caseNumber}</p>}
                  {result.dateFiled && <p className="text-sm text-navy-400">📅 {result.dateFiled}</p>}
                </div>
                <button
                  onClick={() => handleSave(result.id)}
                  disabled={savingId === result.id || savedIds.has(result.id)}
                  className="shrink-0 px-4 py-2 bg-gold-50 text-gold-700 rounded-xl text-sm font-medium hover:bg-gold-100 transition disabled:opacity-50 border border-gold-200"
                >
                  {savedIds.has(result.id) ? "✅ Saved" : savingId === result.id ? "..." : "⭐ Save"}
                </button>
              </div>
              <p className="text-navy-600 mt-3 leading-relaxed text-sm">{result.summary}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-navy-50">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {result.sourceName || "Web"}
                </span>
                {result.sourceUrl && (
                  <a
                    href={result.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                  >
                    View Source →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
