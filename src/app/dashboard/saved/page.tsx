"use client";
import { useState, useEffect, useMemo } from "react";
import { STATES, CATEGORIES } from "@/lib/constants";

interface SavedItem {
  id: string;
  notes: string | null;
  folder: string | null;
  createdAt: string;
  resultId: string;
  resultTitle: string;
  resultSummary: string;
  resultSourceUrl: string | null;
  resultSourceName: string | null;
  resultJurisdiction: string;
  resultCategory: string | null;
  resultCourt: string | null;
  resultCaseNumber: string | null;
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editFolder, setEditFolder] = useState("");
  const [filterFolder, setFilterFolder] = useState("all");

  useEffect(() => {
    fetch("/api/saved")
      .then((r) => r.json())
      .then((d) => setItems(d.saved || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const folders = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => set.add(item.folder || "General"));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    if (filterFolder === "all") return items;
    return items.filter((item) => (item.folder || "General") === filterFolder);
  }, [items, filterFolder]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this saved item?")) return;
    setDeletingId(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch(`/api/saved/${id}`, { method: "DELETE" });
    } catch {
      fetch("/api/saved").then((r) => r.json()).then((d) => setItems(d.saved || []));
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (item: SavedItem) => {
    setEditingId(item.id);
    setEditNotes(item.notes || "");
    setEditFolder(item.folder || "General");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.id === editingId ? { ...i, notes: editNotes, folder: editFolder } : i
      )
    );
    setEditingId(null);
    try {
      await fetch(`/api/saved/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: editNotes, folder: editFolder }),
      });
    } catch {
      fetch("/api/saved").then((r) => r.json()).then((d) => setItems(d.saved || []));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Saved Results</h1>
        <p className="text-navy-500 mt-1">Your bookmarked legal cases and resources</p>
      </div>

      {/* Folder Filter */}
      {folders.length > 0 && !loading && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-navy-500 font-medium">Folder:</span>
          <button
            onClick={() => setFilterFolder("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filterFolder === "all"
                ? "bg-navy-900 text-white"
                : "bg-white text-navy-600 border border-navy-200 hover:bg-navy-50"
            }`}
          >
            All ({items.length})
          </button>
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setFilterFolder(folder)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filterFolder === folder
                  ? "bg-navy-900 text-white"
                  : "bg-white text-navy-600 border border-navy-200 hover:bg-navy-50"
              }`}
            >
              📁 {folder} ({items.filter((i) => (i.folder || "General") === folder).length})
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-navy-100">
              <div className="skeleton w-3/4 h-6 mb-3" />
              <div className="skeleton w-full h-4 mb-2" />
              <div className="skeleton w-2/3 h-4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-navy-100 text-center">
          <span className="text-6xl">⭐</span>
          <h3 className="text-xl font-bold text-navy-700 mt-4">
            {filterFolder === "all" ? "No saved items yet" : "No items in this folder"}
          </h3>
          <p className="text-navy-400 mt-2">
            Save results from your searches to build your case library
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm animate-fade-in"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {editingId === item.id ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-navy-900">{item.resultTitle}</h3>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Folder</label>
                    <input
                      type="text"
                      value={editFolder}
                      onChange={(e) => setEditFolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 outline-none"
                      placeholder="Folder name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Notes</label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 outline-none resize-y"
                      rows={3}
                      placeholder="Add notes..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-navy-800 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-navy-100 text-navy-700 rounded-xl text-sm font-medium hover:bg-navy-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-100 text-gold-700">
                          📁 {item.folder || "General"}
                        </span>
                      </div>
                      <h3 className="font-bold text-navy-900 text-lg">{item.resultTitle}</h3>
                      {item.resultCourt && <p className="text-sm text-navy-500 mt-1">🏛️ {item.resultCourt}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1.5 bg-navy-50 text-navy-700 rounded-lg text-sm hover:bg-navy-100 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition disabled:opacity-50"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-navy-600 mt-3 text-sm leading-relaxed line-clamp-3">{item.resultSummary}</p>

                  {item.notes && (
                    <div className="mt-3 p-3 bg-gold-50 rounded-xl border border-gold-100">
                      <p className="text-sm text-navy-700">
                        <span className="font-medium">📝 Notes:</span> {item.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-navy-50">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {item.resultSourceName || "Web"}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-navy-100 text-navy-700">
                        📍 {STATES[item.resultJurisdiction] || item.resultJurisdiction}
                      </span>
                      {item.resultCategory && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          {CATEGORIES[item.resultCategory] || item.resultCategory}
                        </span>
                      )}
                    </div>
                    {item.resultSourceUrl && (
                      <a
                        href={item.resultSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gold-600 hover:text-gold-700 font-medium"
                      >
                        Source →
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
