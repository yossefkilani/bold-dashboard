"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Submission = {
  id: number;
  full_name: string | null;
  email: string | null;
  project_name: string | null;
  business_sector?: string;
  status: string | null;
  created_at: string | null;
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSubmissions();
  }, []);

  /* ================= LOAD ================= */
  async function loadSubmissions() {
    try {
      setLoading(true);

      const res = await fetch("/api/submissions", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load submissions");
    } finally {
      setLoading(false);
    }
  }

  /* ================= SELECT ================= */
  function toggleSelect(id: number) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  function selectAll() {
    if (selected.length === submissions.length) {
      setSelected([]);
    } else {
      setSelected(submissions.map(s => s.id));
    }
  }

  /* ================= DELETE SINGLE ================= */
  async function handleDelete(id: number) {
    if (!confirm("Delete this submission?")) return;

    const res = await fetch(`/api/submissions/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete submission");
      return;
    }

    setSubmissions(prev => prev.filter(s => s.id !== id));
    setSelected(prev => prev.filter(x => x !== id));
  }

  /* ================= active SELECTED ================= */

  async function activateSubmission(id: number) {
    if (!confirm("Activate this submission?")) return;

    const res = await fetch(
      `/api/submissions/${id}/activate`,
      { method: "POST" }
    );

    if (!res.ok) {
      alert("Failed to activate");
      return;
    }

    // 👇 التحويل مباشرة
    window.location.href = `/dashboard/projects/${id}`;
  }
  /* ================= DELETE SELECTED ================= */
  async function deleteSelected() {
    if (!confirm(`Delete ${selected.length} selected submissions?`))
      return;

    try {
      await Promise.all(
        selected.map(id =>
          fetch(`https://admin.boldbrand.io/api/submissions${id}`, {
            method: "DELETE",
          })
        )
      );

      setSubmissions(prev =>
        prev.filter(s => !selected.includes(s.id))
      );

      setSelected([]);
    } catch {
      alert("Failed to delete selected submissions");
    }
  }

  /* ================= UI ================= */
  if (loading) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }
  function formatDate(value: string | null) {
    if (!value) return "—";

    const d = new Date(value);

    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString();
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Submissions</h1>

        {selected.length > 0 && (
          <button
            onClick={deleteSelected}
            className="border border-red-500 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50 transition"
          >
            Delete selected
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 mb-4 text-sm">{error}</p>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEAD */}
        <div className="grid grid-cols-[40px_1.2fr_1.2fr_1fr_120px_120px] px-6 py-4 text-sm text-gray-500 border-b bg-gray-50">
          <div>
            <input
              type="checkbox"
              onChange={selectAll}
              checked={
                submissions.length > 0 &&
                selected.length === submissions.length
              }
            />
          </div>
          <div>Name</div>
          <div>Project</div>
          <div>Industry</div>
          <div>Status</div>
          <div className="text-right">Created</div>
        </div>

        {submissions.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No submissions yet.
          </div>
        ) : (
          submissions.map(sub => (
            <div
              key={sub.id}
              className="grid grid-cols-[40px_1.2fr_1.2fr_1fr_120px_120px] px-6 py-4 text-sm border-b items-center hover:bg-gray-50 transition"
            >
              {/* SELECT */}
              <div>
                <input
                  type="checkbox"
                  checked={selected.includes(sub.id)}
                  onChange={() => toggleSelect(sub.id)}
                />
              </div>

              {/* NAME */}
              <Link
                href={`/dashboard/submissions/${sub.id}`}
                className="font-medium hover:underline"
              >
                {sub.full_name || "—"}
              </Link>

              {/* PROJECT */}
              <div className="truncate">
                {sub.project_name || "—"}
              </div>

              {/* INDUSTRY */}
              <div className="truncate text-gray-600">
                {sub.business_sector || "—"}
              </div>

              {/* STATUS */}
              <div>
                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                  {sub.status}
                </span>
              </div>
              {sub.status === "new" && (
                <button
                  onClick={() => activateSubmission(sub.id)}
                  className="text-xs bg-black text-white px-3 py-1 rounded"
                >
                  Activate
                </button>
              )}

              {/* CREATED */}
              <div className="text-right text-xs text-gray-400">
                {formatDate(sub.created_at)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}