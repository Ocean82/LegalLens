"use client";
import { useState, useEffect } from "react";
import { STATES, CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";

interface Note {
  id: string;
  title: string;
  content: string;
  jurisdiction: string | null;
  category: string | null;
  pinned: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    jurisdiction: "",
    category: "",
  });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    setSaving(true);

    try {
      if (editingNote) {
        // Update
        const res = await fetch(`/api/notes/${editingNote.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            jurisdiction: formData.jurisdiction || null,
            category: formData.category || null,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setNotes((prev) =>
            prev.map((n) => (n.id === editingNote.id ? data.note : n))
          );
        }
      } else {
        // Create
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            jurisdiction: formData.jurisdiction || undefined,
            category: formData.category || undefined,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setNotes((prev) => [data.note, ...prev]);
        }
      }
      resetForm();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", jurisdiction: "", category: "" });
    setEditingNote(null);
    setShowForm(false);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      jurisdiction: note.jurisdiction || "",
      category: note.category || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
    } catch {
      fetchNotes();
    }
  };

  const handleTogglePin = async (note: Note) => {
    const newPinned = !note.pinned;
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, pinned: newPinned } : n))
    );
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: newPinned }),
      });
    } catch {
      fetchNotes();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Research Notes</h1>
          <p className="text-navy-500 mt-1">Document and organize your legal research</p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
            showForm
              ? "bg-navy-100 text-navy-700 hover:bg-navy-200"
              : "bg-navy-900 text-white hover:bg-navy-800"
          }`}
        >
          {showForm ? "Cancel" : "+ New Note"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm mb-8 animate-fade-in"
        >
          <h2 className="text-lg font-bold text-navy-900 mb-4">
            {editingNote ? "Edit Note" : "New Research Note"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition"
                placeholder="Note title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData((f) => ({ ...f, content: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition resize-y font-mono text-sm"
                rows={8}
                placeholder="Write your research notes here..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Jurisdiction</label>
                <select
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData((f) => ({ ...f, jurisdiction: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 outline-none bg-white"
                >
                  <option value="">None</option>
                  {Object.entries(STATES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-navy-200 focus:ring-2 focus:ring-gold-500 outline-none bg-white"
                >
                  <option value="">None</option>
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>{CATEGORY_ICONS[key]} {label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : editingNote ? "Update Note" : "Create Note"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-navy-100 text-navy-700 rounded-xl font-medium hover:bg-navy-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notes list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-navy-100">
              <div className="skeleton w-1/2 h-6 mb-3" />
              <div className="skeleton w-full h-4 mb-2" />
              <div className="skeleton w-3/4 h-4" />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-navy-100 text-center">
          <span className="text-6xl">📝</span>
          <h3 className="text-xl font-bold text-navy-700 mt-4">No research notes yet</h3>
          <p className="text-navy-400 mt-2 mb-6">Create your first note to document your legal research</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition"
          >
            Create Your First Note
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note, idx) => (
            <div
              key={note.id}
              className={`bg-white rounded-2xl border shadow-sm transition animate-fade-in ${
                note.pinned ? "border-gold-300 ring-1 ring-gold-200" : "border-navy-100"
              }`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {note.pinned && (
                        <span className="text-gold-500 text-sm">📌</span>
                      )}
                      <h3 className="font-bold text-navy-900 text-lg">{note.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      {note.jurisdiction && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-700">
                          📍 {STATES[note.jurisdiction] || note.jurisdiction}
                        </span>
                      )}
                      {note.category && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-700">
                          {CATEGORY_ICONS[note.category] || "📁"} {CATEGORIES[note.category] || note.category}
                        </span>
                      )}
                      <span className="text-xs text-navy-400">
                        Updated {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleTogglePin(note)}
                      className={`p-2 rounded-lg text-sm transition ${
                        note.pinned
                          ? "bg-gold-100 text-gold-600 hover:bg-gold-200"
                          : "bg-navy-50 text-navy-400 hover:bg-navy-100"
                      }`}
                      title={note.pinned ? "Unpin" : "Pin"}
                    >
                      📌
                    </button>
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-2 bg-navy-50 text-navy-500 rounded-lg hover:bg-navy-100 transition"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <pre
                    className={`text-sm text-navy-600 whitespace-pre-wrap font-sans leading-relaxed ${
                      expandedId === note.id ? "" : "line-clamp-4"
                    }`}
                  >
                    {note.content}
                  </pre>
                  {note.content.length > 200 && (
                    <button
                      onClick={() => setExpandedId(expandedId === note.id ? null : note.id)}
                      className="text-sm text-gold-600 hover:text-gold-700 font-medium mt-2"
                    >
                      {expandedId === note.id ? "Show less ↑" : "Read more ↓"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
