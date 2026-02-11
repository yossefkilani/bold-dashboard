"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/* ======================
   TYPES
====================== */
type Phase = {
  id: number;
  title: string;
  duration_days: number;
  position: number;
  start_date?: string | null;
};

type Payment = {
  id: number;
  title: string;
  amount: number;
  payment_date: string;
};

type Project = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  project_name: string;
  business_sector: string;
  start_date: string;
  total_price: number;
  paid_amount: number;
  status: string;
  created_at: string;
  project_references: string; // JSON
};

/* ======================
   PAGE
====================== */
export default function ProjectDetailsPage() {
  const { id } = useParams();

  const [project, setProject] =
    useState<Project | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [references, setReferences] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Inputs
  const [phaseTitle, setPhaseTitle] =
    useState("");
  const [phaseDays, setPhaseDays] =
    useState("");

  const [payTitle, setPayTitle] =
    useState("");
  const [payAmount, setPayAmount] =
    useState("");
  const [payDate, setPayDate] =
    useState("");

  const [newLink, setNewLink] =
    useState("");

  /* ======================
     HELPERS
  ====================== */

  function addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  function calculateTimeline(
    startDate: string,
    phases: Phase[]
  ) {
    if (!startDate) return [];

    let current = new Date(startDate);

    return phases.map(p => {
      const phaseStart = p.start_date
        ? new Date(p.start_date)
        : new Date(current);

      const phaseEnd = addDays(
        phaseStart,
        p.duration_days - 1
      );

      current = addDays(phaseEnd, 1);

      return {
        ...p,
        start: formatDate(phaseStart),
        end: formatDate(phaseEnd)
      };
    });
  }

  const timeline = calculateTimeline(
    project?.start_date || "",
    phases
  );

  /* ======================
     LOAD PROJECT
  ====================== */
  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(
        `/api/projects/${id}`
      );
      const data = await res.json();

      setProject(data.project);
      setPhases(data.phases || []);
      setPayments(data.payments || []);

      try {
        const refs = JSON.parse(
          data.project.project_references || "[]"
        );
        setReferences(refs);
      } catch {
        setReferences([]);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  /* ======================
     PHASES
  ====================== */
  async function addPhase() {
    if (!phaseTitle || !phaseDays) return;

    const res = await fetch(
      `/api/projects/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          type: "phase",
          title: phaseTitle,
          duration_days: Number(phaseDays)
        })
      }
    );

    const data = await res.json();

    if (res.ok) {
      setPhases(prev => [
        ...prev,
        {
          id: data.id,
          title: phaseTitle,
          duration_days: Number(phaseDays),
          position: prev.length + 1
        }
      ]);

      setPhaseTitle("");
      setPhaseDays("");
    }
  }

  async function updatePhaseDate(
    phaseId: number,
    date: string
  ) {
    const res = await fetch(
      `/api/projects/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          type: "phase-date",
          phaseId,
          start_date: date
        })
      }
    );

    if (res.ok) {
      setPhases(prev =>
        prev.map(p =>
          p.id === phaseId
            ? { ...p, start_date: date }
            : p
        )
      );
    }
  }

  /* ======================
     PAYMENTS
  ====================== */
  async function addPayment() {
    if (!payTitle || !payAmount || !payDate)
      return;

    const res = await fetch(
      `/api/projects/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          type: "payment",
          title: payTitle,
          amount: Number(payAmount),
          payment_date: payDate
        })
      }
    );

    const data = await res.json();

    if (res.ok) {
      setPayments(prev => [
        ...prev,
        {
          id: data.id,
          title: payTitle,
          amount: Number(payAmount),
          payment_date: payDate
        }
      ]);

      setPayTitle("");
      setPayAmount("");
      setPayDate("");
    }
  }

  /* ======================
     REFERENCES
  ====================== */
  async function addReference() {
    if (!newLink.trim() || !project)
      return;

    const updated = [
      ...references,
      newLink.trim()
    ];

    await fetch(
      `/api/projects/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          type: "references",
          project_references: updated
        })
      }
    );

    setReferences(updated);
    setNewLink("");
  }

  /* ======================
     UI
  ====================== */
  if (loading || !project) {
    return <p>Loading…</p>;
  }

  const totalPaid = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  const remainingAmount =
    Number(project.total_price || 0) - totalPaid;

  return (
    <div className="max-w-4xl space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          {project.project_name ||
            "Untitled Project"}
        </h1>
        <p className="text-sm text-gray-500">
          Status: {project.status}
        </p>
      </div>

      {/* CLIENT */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
        <h2 className="font-semibold text-lg">
          Client
        </h2>
        <p>
          <strong>Name:</strong>{" "}
          {project.full_name}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {project.email}
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          {project.phone}
        </p>
      </div>

      {/* FINANCIALS */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4">
          Financials
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="text-xs text-gray-500">
              Total
            </div>
            <div className="font-semibold">
              ${project.total_price}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="text-xs text-gray-500">
              Paid
            </div>
            <div className="font-semibold text-green-600">
              ${totalPaid}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="text-xs text-gray-500">
              Remaining
            </div>
            <div className="font-semibold text-red-600">
              ${remainingAmount}
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE / PHASES */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-lg">
          Timeline / Phases
        </h2>

        <div className="flex gap-2">
          <input
            placeholder="Phase title"
            className="flex-1 border p-2 rounded-lg"
            value={phaseTitle}
            onChange={e =>
              setPhaseTitle(e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Days"
            className="w-24 border p-2 rounded-lg"
            value={phaseDays}
            onChange={e =>
              setPhaseDays(e.target.value)
            }
          />
          <button
            onClick={addPhase}
            className="px-4 bg-black text-white rounded-lg"
          >
            +
          </button>
        </div>

        {timeline.length === 0 && (
          <p className="text-sm text-gray-400">
            No phases yet
          </p>
        )}

        {timeline.map((p, i) => (
          <div
            key={p.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">
                {i + 1}. {p.title}
              </div>
              <div className="text-sm text-gray-500">
                {p.duration_days} days
              </div>
            </div>

            <div className="text-sm text-gray-500 text-right space-y-1">
              <div>
                Start:
                <input
                  type="date"
                  value={p.start}
                  className="ml-2 border rounded px-2 py-1 text-xs"
                  onChange={e =>
                    updatePhaseDate(
                      p.id,
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                End: {p.end}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAYMENTS */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-lg">
          Payments
        </h2>

        <div className="grid grid-cols-4 gap-2">
          <input
            placeholder="Title"
            className="border p-2 rounded-lg"
            value={payTitle}
            onChange={e =>
              setPayTitle(e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Amount"
            className="border p-2 rounded-lg"
            value={payAmount}
            onChange={e =>
              setPayAmount(e.target.value)
            }
          />
          <input
            type="date"
            className="border p-2 rounded-lg"
            value={payDate}
            onChange={e =>
              setPayDate(e.target.value)
            }
          />
          <button
            onClick={addPayment}
            className="bg-black text-white rounded-lg"
          >
            Add
          </button>
        </div>

        {payments.length === 0 && (
          <p className="text-sm text-gray-400">
            No payments yet
          </p>
        )}

        {payments.map(p => (
          <div
            key={p.id}
            className="border rounded-lg p-4 flex justify-between"
          >
            <div>
              <div className="font-medium">
                {p.title}
              </div>
              <div className="text-sm text-gray-500">
                {p.payment_date}
              </div>
            </div>
            <div className="font-semibold">
              ${p.amount}
            </div>
          </div>
        ))}
      </div>

      {/* REFERENCES */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-lg">
          References / Links
        </h2>

        <div className="flex gap-2">
          <input
            placeholder="Paste link"
            className="flex-1 border p-2 rounded-lg"
            value={newLink}
            onChange={e =>
              setNewLink(e.target.value)
            }
          />
          <button
            onClick={addReference}
            className="bg-black text-white px-4 rounded-lg"
          >
            +
          </button>
        </div>

        {references.length === 0 && (
          <p className="text-sm text-gray-400">
            No references yet
          </p>
        )}

        {references.map((r, i) => (
          <div
            key={i}
            className="border rounded-lg p-3 truncate"
          >
            {r}
          </div>
        ))}
      </div>

      {/* META */}
      <div className="text-xs text-gray-400">
        Created at:{" "}
        {new Date(
          project.created_at
        ).toLocaleString()}
      </div>
    </div>
  );
}