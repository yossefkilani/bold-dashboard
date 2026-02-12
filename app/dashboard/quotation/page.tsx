"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Quotation = {
  id: string;
  project?: string;
  client?: string;
  status: string;
  created_at?: string;
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  sent: "Sent",
  approved: "Approved",
};

export default function QuotationPage() {
  const [items, setItems] = useState<Quotation[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/quotation", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      console.log("QUOTATIONS API DATA:", data);
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => {
            const da = new Date(a.created_at || 0).getTime();
            const db = new Date(b.created_at || 0).getTime();
            return db - da; // الأحدث أولًا
          })
        : [];

      setItems(sorted);
    } catch {
      setError("Could not load quotations");
    } finally {
      setLoading(false);
    }
  }

  /* =====================
     SELECT HELPERS
  ===================== */

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  function selectAll() {
    if (selected.length === items.length) {
      setSelected([]);
    } else {
      setSelected(items.map((q) => q.id));
    }
  }

  /* =====================
     ACTIONS
  ===================== */

  async function deleteSelected() {
    if (selected.length === 0) return;

    const ok = confirm(
      `Delete ${selected.length} selected quotations?`
    );
    if (!ok) return;

    try {
      await Promise.all(
        selected.map((id) =>
          fetch(`/api/quotation/${id}`, {
            method: "DELETE",
          })
        )
      );

      setItems((prev) =>
        prev.filter((q) => !selected.includes(q.id))
      );
      setSelected([]);
    } catch {
      alert("Failed to delete selected quotations");
    }
  }
  function printSelected() {
    if (selected.length === 0) return;

    const w = window.open("", "_blank");
    if (!w) return;

    w.document.write(`
      <html>
        <head>
          <title>Print Quotations</title>
          <style>
            body {
              margin: 0;
              background: #f0f0f0;
            }
            iframe {
              width: 100%;
              height: 100vh;
              border: none;
              page-break-after: always;
            }
          </style>
        </head>
        <body>
    `);

    selected.forEach((id) => {
      w.document.write(`
        <iframe src="/quotation-static/template.html?id=${id}"></iframe>
      `);
    });

    w.document.write(`
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);

    w.document.close();
  }

  function formatDate(value: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString();
  }

  async function deleteOne(id: string) {
    const ok = confirm("Delete this quotation?");
    if (!ok) return;

    try {
      const res = await fetch(
        `/api/quotation/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        alert("Failed to delete quotation");
        return;
      }

      setItems((prev) =>
        prev.filter((q) => q.id !== id)
      );
      setSelected((prev) =>
        prev.filter((x) => x !== id)
      );
    } catch {
      alert("Server error");
    }
  }

  /* =====================
     UI
  ===================== */

  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading quotations...
      </p>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Quotations
          {selected.length > 0 && (
            <span className="text-sm text-gray-400 ml-2">
              ({selected.length} selected)
            </span>
          )}
        </h1>

        <div className="flex gap-2">
          {selected.length > 0 && (
            <>
              <button
                onClick={printSelected}
                className="border px-4 py-2 rounded text-sm hover:bg-gray-100 transition"
              >
                Print selected
              </button>

              <button
                onClick={deleteSelected}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
              >
                Delete selected
              </button>
            </>
          )}

          <Link
            href="/dashboard/quotation/new"
            className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
          >
            Add new quotation +
          </Link>
        </div>
      </div>

      {error && (
        <p className="text-red-500 mb-4 text-sm">
          {error}
        </p>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* HEAD */}
        <div className="grid grid-cols-5 px-6 py-4 text-sm text-gray-500 border-b bg-gray-50">
          {/* Select All */}
          <div>
            <input
              type="checkbox"
              checked={
                items.length > 0 &&
                selected.length === items.length
              }
              onChange={selectAll}
            />
          </div>

          <div>Quotation</div>
          <div>Status</div>
          <div>Created</div>
          <div className="text-right">Actions</div>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No quotations yet.
          </div>
        ) : (
          items.map((q) => (
            <div
              key={q.id}
              className="grid grid-cols-5 px-6 py-4 text-sm border-b items-center hover:bg-gray-50 transition"
            >
              {/* Checkbox */}
              <div>
                <input
                  type="checkbox"
                  checked={selected.includes(q.id)}
                  onChange={() => toggleSelect(q.id)}
                />
              </div>

              {/* Quotation */}
              <button
                onClick={() => {
                  const params = new URLSearchParams({
                    client: q.client || "",
                    project: q.project || "",
                    date: q.created_at || "",
                    total: (q as any).total || "",
                    currency: (q as any).currency || "KWD",
                    terms: (q as any).terms || "",
                    bank: (q as any).bank ? "1" : "0",
                    phases: (q as any).phases || "[]",
                  });

                  window.open(
                    `/quotation-static/template.html?${params.toString()}`,
                    "_blank"
                  );
                }}
                className="text-left w-full hover:underline"
              >
                <div>
                  <div className="font-medium">
                    {q.project || "Untitled quotation"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {q.client || "—"}
                  </div>
                </div>
              </button>

              {/* Status */}
              <div>
                {STATUS_LABELS[q.status] || q.status || "—"}
              </div>

              {/* Created */}
              <div>
                {formatDate(q.created_at ?? null)}
              </div>

              {/* Actions */}
              <div className="text-right">
                <button
                  onClick={() => deleteOne(q.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}