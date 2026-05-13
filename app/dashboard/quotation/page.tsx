"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Quotation = {
  id: string;
  client: string;
  project: string;
  date: string;
  total: string;
  currency: string;
  terms: string;
  bank: number;
  phases: string;
  status: string;
  created_at: string;
};

export default function QuotationPage() {
  const [items, setItems] = useState<Quotation[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/quotation", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(Array.isArray(data) ? data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : []);
    } catch { setError("Could not load quotations"); }
    finally { setLoading(false); }
  }

  function toggleSelect(id: string) {
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }
  function selectAll() {
    setSelected(selected.length === items.length ? [] : items.map((q) => q.id));
  }

  async function deleteOne(id: string) {
    if (!confirm("Delete this quotation?")) return;
    await fetch(`/api/quotation/${id}`, { method: "DELETE" });
    setItems((p) => p.filter((q) => q.id !== id));
    setSelected((p) => p.filter((x) => x !== id));
  }

  async function deleteSelected() {
    if (!confirm(`Delete ${selected.length} quotations?`)) return;
    await Promise.all(selected.map((id) => fetch(`/api/quotation/${id}`, { method: "DELETE" })));
    setItems((p) => p.filter((q) => !selected.includes(q.id)));
    setSelected([]);
  }

  function openPreview(q: Quotation) {
    let phases: any[] = [];
    try { phases = JSON.parse(q.phases || "[]"); } catch {}
    const params = new URLSearchParams({
      client: q.client,
      project: q.project,
      date: q.date || "",
      total: q.total,
      currency: q.currency,
      terms: q.terms,
      bank: q.bank ? "1" : "0",
      phases: JSON.stringify(phases),
    });
    window.open(`/quotation-static/template.html?${params}`, "_blank");
  }

  function fmt(v: string) {
    if (!v) return "—";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  }

  if (loading) return <p className="text-gray-400">Loading quotations...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Quotations{selected.length > 0 && <span className="text-sm text-gray-400 ml-2">({selected.length} selected)</span>}
        </h1>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <button onClick={deleteSelected} className="border border-red-500 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50">
              Delete selected
            </button>
          )}
          <Link href="/dashboard/quotation/new" className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800">
            New quotation +
          </Link>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-5 px-6 py-3 text-xs text-gray-500 border-b bg-gray-50">
          <div><input type="checkbox" checked={items.length > 0 && selected.length === items.length} onChange={selectAll} /></div>
          <div>Quotation</div>
          <div>Status</div>
          <div>Created</div>
          <div className="text-right">Actions</div>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-sm text-gray-400">No quotations yet.</div>
        ) : items.map((q) => (
          <div key={q.id} className="grid grid-cols-5 px-6 py-4 text-sm border-b items-center hover:bg-gray-50">
            <div><input type="checkbox" checked={selected.includes(q.id)} onChange={() => toggleSelect(q.id)} /></div>

            <button onClick={() => openPreview(q)} className="text-left hover:underline">
              <div className="font-medium">{q.project || "Untitled"}</div>
              <div className="text-xs text-gray-400">{q.client || "—"}</div>
            </button>

            <div>
              <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">{q.status}</span>
            </div>

            <div className="text-xs text-gray-500">{fmt(q.created_at)}</div>

            <div className="text-right flex items-center justify-end gap-3">
              <button onClick={() => openPreview(q)} className="text-blue-600 text-xs hover:underline">Print / PDF</button>
              <button onClick={() => deleteOne(q.id)} className="text-red-500 text-xs hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
