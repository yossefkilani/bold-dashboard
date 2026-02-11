"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Project = {
  id: number;
  project_name: string | null;
  full_name: string | null;
  status: string | null;
  created_at: string | null;

  total_price: number | null;
  paid_amount: number | null;
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  active: "Active",
  completed: "Completed",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  /* ================= LOAD ================= */
  async function loadProjects() {
    try {
      setLoading(true);
      const res = await fetch("/api/projects", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load projects");
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
    if (selected.length === projects.length) {
      setSelected([]);
    } else {
      setSelected(projects.map(p => p.id));
    }
  }

  /* ================= DELETE ================= */
  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete project");
        return;
      }

      setProjects(prev => prev.filter(p => p.id !== id));
      setSelected(prev => prev.filter(x => x !== id));
    } catch {
      alert("Server error while deleting project");
    }
  }

  async function deleteSelected() {
    if (
      !confirm(`Delete ${selected.length} selected projects?`)
    )
      return;

    try {
      await Promise.all(
        selected.map(id =>
          fetch(`/api/projects/${id}`, {
            method: "DELETE",
          })
        )
      );

      setProjects(prev =>
        prev.filter(p => !selected.includes(p.id))
      );
      setSelected([]);
    } catch {
      alert("Failed to delete selected projects");
    }
  }

  /* ================= HELPERS ================= */
  function formatDate(value: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime())
      ? "—"
      : d.toLocaleDateString();
  }

  function formatMoney(val: number | null) {
    if (val == null) return "—";
    return `${val.toLocaleString()} KD`;
  }

  function getRemaining(p: Project) {
    if (p.total_price == null || p.paid_amount == null)
      return "—";
    return formatMoney(p.total_price - p.paid_amount);
  }

  /* ================= UI ================= */
  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading projects...
      </p>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Projects
        </h1>

        <div className="flex items-center gap-3">
          {selected.length > 0 && (
            <>
              <button
                onClick={deleteSelected}
                className="border border-red-500 text-red-600 px-4 py-2 rounded text-sm hover:bg-red-50 transition"
              >
                Delete selected
              </button>
            </>
          )}

          <Link
            href="/dashboard/projects/new"
            className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
          >
            Add new project +
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
        <div className="grid grid-cols-7 px-6 py-4 text-sm text-gray-500 border-b bg-gray-50">
          <div>
            <input
              type="checkbox"
              onChange={selectAll}
              checked={
                projects.length > 0 &&
                selected.length === projects.length
              }
            />
          </div>
          <div>Project</div>
          <div>Status</div>
          <div>Total</div>
          <div>Paid</div>
          <div>Remain</div>
          <div className="text-right">
            Created
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No projects yet.
          </div>
        ) : (
          projects.map(project => (
            <div
              key={project.id}
              className="grid grid-cols-7 px-6 py-4 text-sm border-b items-center hover:bg-gray-50 transition"
            >
              {/* SELECT */}
              <div>
                <input
                  type="checkbox"
                  checked={selected.includes(project.id)}
                  onChange={() =>
                    toggleSelect(project.id)
                  }
                />
              </div>

              {/* PROJECT */}
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="hover:underline"
              >
                <div>
                  <div className="font-medium">
                    {project.project_name ||
                      "Untitled project"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {project.full_name || "—"}
                  </div>
                </div>
              </Link>

              {/* STATUS */}
              <div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    project.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : project.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {STATUS_LABELS[
                    project.status || "new"
                  ] || project.status}
                </span>
              </div>

              {/* TOTAL */}
              <div className="text-xs">
                {formatMoney(
                  project.total_price
                )}
              </div>

              {/* PAID */}
              <div className="text-xs text-green-600">
                {formatMoney(
                  project.paid_amount
                )}
              </div>

              {/* REMAIN */}
              <div className="text-xs text-red-600">
                {getRemaining(project)}
              </div>

              {/* CREATED */}
              <div className="text-right text-xs text-gray-400">
                {formatDate(
                  project.created_at
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}