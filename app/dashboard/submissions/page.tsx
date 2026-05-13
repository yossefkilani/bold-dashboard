"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Submission = {
  id: number;
  full_name: string | null;
  email: string | null;
  phone: string | null;
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

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/submissions", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch { setError("Could not load submissions"); }
    finally { setLoading(false); }
  }

  function toggleSelect(id: number) {
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }
  function selectAll() {
    setSelected(selected.length === submissions.length ? [] : submissions.map((s) => s.id));
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this submission?")) return;
    const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Failed to delete"); return; }
    setSubmissions((p) => p.filter((s) => s.id !== id));
    setSelected((p) => p.filter((x) => x !== id));
  }

  async function deleteSelected() {
    if (!confirm(`Delete ${selected.length} submissions?`)) return;
    await Promise.all(selected.map((id) => fetch(`/api/submissions/${id}`, { method: "DELETE" })));
    setSubmissions((p) => p.filter((s) => !selected.includes(s.id)));
    setSelected([]);
  }

  async function activate(sub: Submission) {
    if (!confirm("Activate and create project?")) return;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: sub.full_name || "",
        project: sub.project_name || "",
        contacts: sub.email ? [{ type: "Email", value: sub.email }] : [],
        business: sub.business_sector || "",
        startDate: new Date().toISOString().split("T")[0],
        notes: "", phases: [], links: [], total: "", currency: "KWD", payments: [],
      }),
    });

    if (!res.ok) { alert("Failed to create project"); return; }
    const { projectId } = await res.json();

    await fetch(`/api/submissions/${sub.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active" }),
    });

    window.location.href = `/dashboard/projects/${projectId}`;
  }

  function fmt(v: string | null) {
    if (!v) return "—";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  }

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Submissions</h1>
        {selected.length > 0 && (
          <button onClick={deleteSelected} className="border border-red-500 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50">
            Delete selected ({selected.length})
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[40px_1.2fr_1.2fr_1fr_180px_110px] px-6 py-3 text-xs text-gray-500 border-b bg-gray-50">
          <div><input type="checkbox" onChange={selectAll} checked={submissions.length > 0 && selected.length === submissions.length} /></div>
          <div>Name</div>
          <div>Project</div>
          <div>Industry</div>
          <div>Status</div>
          <div className="text-right">Date</div>
        </div>

        {submissions.length === 0 ? (
          <div className="p-6 text-sm text-gray-400">No submissions yet.</div>
        ) : submissions.map((sub) => (
          <div key={sub.id} className="grid grid-cols-[40px_1.2fr_1.2fr_1fr_180px_110px] px-6 py-4 text-sm border-b items-center hover:bg-gray-50">
            <div><input type="checkbox" checked={selected.includes(sub.id)} onChange={() => toggleSelect(sub.id)} /></div>

            <Link href={`/dashboard/submissions/${sub.id}`} className="font-medium hover:underline">
              {sub.full_name || "—"}
            </Link>

            <div className="truncate">{sub.project_name || "—"}</div>
            <div className="truncate text-gray-500">{sub.business_sector || "—"}</div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">{sub.status}</span>
              {sub.status === "new" && (
                <button onClick={() => activate(sub)} className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
                  Activate
                </button>
              )}
            </div>

            <div className="text-right text-xs text-gray-400 flex justify-end gap-2 items-center">
              {fmt(sub.created_at)}
              <button onClick={() => handleDelete(sub.id)} className="text-gray-300 hover:text-red-500 text-base leading-none">×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
