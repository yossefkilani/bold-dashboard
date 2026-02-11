"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Case = {
  id: number;
  title: string;
  industry: string;
  slug: string;
};

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    fetch("/api/cases")
      .then(res => res.json())
      .then(setCases);
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this case?")) return;

    await fetch(`/api/cases/${id}`, {
      method: "DELETE",
    });

    setCases(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="p-8">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Cases</h1>

        <Link
          href="/dashboard/site-editor/cases/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Case +
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        {cases.map(c => (
          <div
            key={c.id}
            className="flex justify-between items-center px-6 py-4 border-b"
          >
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-gray-400">
                {c.industry}
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <Link
                href={`/dashboard/site-editor/cases/${c.id}/edit`}
                className="text-blue-600"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}