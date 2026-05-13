"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Case = {
  id: number;
  title: string;
  industry: string;
  cover_image: string;
  created_at: string;
};

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-editor/cases")
      .then((r) => r.json())
      .then((d) => setCases(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this case?")) return;
    await fetch(`/api/site-editor/cases/${id}`, { method: "DELETE" });
    setCases((p) => p.filter((c) => c.id !== id));
  }

  const imgSrc = (url: string) =>
    !url ? "" : url.startsWith("http") ? url : `${window.location.origin}${url}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cases</h1>
        <Link href="/dashboard/site-editor/cases/new" className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800">
          Add Case +
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : cases.length === 0 ? (
        <p className="text-gray-400">No cases yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border overflow-hidden">
              {c.cover_image ? (
                <img src={imgSrc(c.cover_image)} className="w-full h-40 object-cover" alt="" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-300 text-sm">No image</div>
              )}
              <div className="p-4">
                <p className="font-semibold">{c.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.industry || "—"}</p>
                <div className="flex gap-3 mt-3 text-sm">
                  <Link href={`/dashboard/site-editor/cases/${c.id}/edit`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">
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
