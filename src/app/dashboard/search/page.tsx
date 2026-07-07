"use client";
import { useState } from "react";
import { STATES, CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";

interface SearchResult {
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

function ResultCard({ result, onSave, saving }: { result: SearchResult; onSave: () => void; saving: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm hover:shadow-md transition animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-navy-900 text-lg leading-tight">{result.title}</h3>
          {result.court && (
            <p className="text-sm text-navy-500 mt-1">🏛️ {result.court}</p>
          )}
          {result.caseNumber && (
            <p className="text-sm text-navy-400 mt-0.5">Case No: {result.caseNumber}</p>
          )}
          {result.dateFiled && (
            <p className="text-sm text-navy-400 mt-0.5">📅 {result.dateFiled}</p>
          )}
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="shrink-0 px-4 py-2 bg-gold-50 text-gold-700 rounded-xl text-sm font-medium hover:bg-gold-100 transition disabled:opacity-50 border border-gold-200"
        >
          {saving ? "Saving..." : "⭐ Save"}
        </button>
      </div>

      <p className="text-navy-600 mt-4 leading-relaxed text-sm">{result.summary}</p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-navy-50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {result.sourceName || "Web"}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-navy-100 text-navy-700">
            📍 {STATES[result.jurisdiction] || result.jurisdiction}
          </span>
        </div>
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
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-navy-100">
          <div className="skeleton w-3/4 h-6 mb-3" />
          <div className="skeleton w-1/2 h-4 mb-4" />
          <div className="skeleton w-full h-4 mb-2" />
          <div className="skeleton w-full h-4 mb-2" />
          <div className="skeleton w-2/3 h-4" />
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("federal");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    setResults([]);
    setSearched(false);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, jurisdiction, category: category || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results || []);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSearching(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Legal Search</h1>
        <p className="text-navy-500 mt-1">
          Search across multiple legal databases for court cases, statutes, and regulations
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-2">Search Query</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='e.g. "tenant rights eviction" or "first amendment free speech"'
                className="w-full px-5 py-4 pl-12 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition text-lg"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Jurisdiction</label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition bg-white"
              >
                {Object.entries(STATES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {key === "federal" ? "🏛️ " : "📍 "}{label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">Category (optional)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition bg-white"
              >
                <option value="">All Categories</option>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {CATEGORY_ICONS[key]} {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="w-full bg-navy-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-navy-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scraping legal databases...
              </span>
            ) : (
              "Search Legal Databases"
            )}
          </button>
        </div>

        {/* Sources */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-navy-400">Sources:</span>
          {["Google Scholar", "CourtListener", "Cornell Law", "Justia"].map((s) => (
            <span key={s} className="px-2 py-0.5 bg-navy-50 text-navy-500 rounded text-xs">
              {s}
            </span>
          ))}
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl border border-red-100 mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {searching && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-5 h-5 border-2 border-navy-300 border-t-gold-500 rounded-full animate-spin" />
            <p className="text-navy-600 font-medium">
              Scraping legal databases for &quot;{query}&quot;...
            </p>
          </div>
          <SearchSkeleton />
        </div>
      )}

      {/* Results */}
      {!searching && searched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy-900">
              {results.length} Result{results.length !== 1 ? "s" : ""} Found
            </h2>
            <span className="text-sm text-navy-400">
              📍 {STATES[jurisdiction]}{category ? ` · ${CATEGORIES[category]}` : ""}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-navy-100 text-center">
              <span className="text-5xl">📭</span>
              <h3 className="text-xl font-bold text-navy-700 mt-4">No results found</h3>
              <p className="text-navy-400 mt-2 max-w-md mx-auto">
                Try broadening your search terms, changing the jurisdiction, or removing the category filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  onSave={() => handleSave(result.id)}
                  saving={savingId === result.id || savedIds.has(result.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state - before search */}
      {!searching && !searched && (
        <div className="bg-white rounded-2xl p-12 border border-navy-100 text-center">
          <span className="text-6xl">⚖️</span>
          <h3 className="text-xl font-bold text-navy-700 mt-4">Ready to Research</h3>
          <p className="text-navy-400 mt-2 max-w-md mx-auto">
            Enter a legal question, select a jurisdiction, and we&apos;ll scrape multiple legal databases
            to find relevant court cases, statutes, and legal resources.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            {[
              "First Amendment rights",
              "Tenant eviction laws",
              "Employment discrimination",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setQuery(example)}
                className="px-3 py-2 bg-navy-50 rounded-lg text-sm text-navy-600 hover:bg-navy-100 transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
