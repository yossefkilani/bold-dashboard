"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/* ================= TYPES ================= */
type Phase = {
  title: string;
  desc: string;
  days: string;
};

type Payment = {
  title: string;
  amount: string;
  date: string;
};

type Contact = {
  type: "Email" | "Phone" | "WhatsApp";
  value: string;
};

/* ================= PAGE ================= */
export default function CreateProjectPage() {
  const router = useRouter();

  /* ================= BASIC ================= */
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [business, setBusiness] = useState("");
  const [notes, setNotes] = useState("");

  /* ================= CONTACTS ================= */
  const [contacts, setContacts] = useState<Contact[]>([
    { type: "Phone", value: "" }
  ]);

  function addContact() {
    setContacts([...contacts, { type: "Email", value: "" }]);
  }

  function updateContact(
    index: number,
    field: keyof Contact,
    value: string
  ) {
    const copy = [...contacts];

    if (field === "type") {
      copy[index][field] = value as Contact["type"];
    } else {
      copy[index][field] = value as Contact["value"];
    }

    setContacts(copy);
  }

  function removeContact(index: number) {
    setContacts(contacts.filter((_, i) => i !== index));
  }

  /* ================= PHASES ================= */
  const [phases, setPhases] = useState<Phase[]>([
    {
      title: "Branding Design",
      desc: `Logo Design
Visual Identity
1- Color Palette
2- Font Selection`,
      days: "7"
    }
  ]);

  function addPhase() {
    setPhases([...phases, { title: "", desc: "", days: "" }]);
  }

  function updatePhase(
    index: number,
    field: keyof Phase,
    value: string
  ) {
    const copy = [...phases];
    copy[index][field] = value;
    setPhases(copy);
  }

  function removePhase(index: number) {
    setPhases(phases.filter((_, i) => i !== index));
  }

  /* ================= LINKS ================= */
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");

  function addLink() {
    if (!linkInput.trim()) return;
    setLinks([...links, linkInput.trim()]);
    setLinkInput("");
  }

  function removeLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  /* ================= FINANCIALS ================= */
  const [currency, setCurrency] = useState("KWD");
  const [total, setTotal] = useState("");

  const [payments, setPayments] = useState<Payment[]>([
    {
      title: "First Payment",
      amount: "",
      date: startDate
    }
  ]);

  function addPayment() {
    setPayments([
      ...payments,
      { title: "Payment", amount: "", date: startDate }
    ]);
  }

  function updatePayment(
    i: number,
    field: keyof Payment,
    value: string
  ) {
    const copy = [...payments];
    copy[i][field] = value;
    setPayments(copy);
  }

  function removePayment(index: number) {
    setPayments(payments.filter((_, i) => i !== index));
  }

  /* ================= SUBMIT ================= */
  async function createProject() {
    if (!client || !project || contacts.some(c => !c.value)) {
      alert("Please fill required fields");
      return;
    }

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client,
        project,
        contacts,
        startDate,
        business,
        notes,
        phases,
        links,
        total,
        currency,
        payments
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to create project");
      return;
    }

    router.push(`/dashboard/projects/${data.projectId}`);
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-xl mx-auto px-6 pb-32">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold">
          Create New Project
        </h1>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl border p-5 space-y-5">

        {/* CLIENT */}
        <div>
          <label className="block text-sm mb-1">
            Client Name
          </label>
          <input
            className="w-full border rounded-xl px-4 py-3"
            value={client}
            onChange={e => setClient(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Project Name
          </label>
          <input
            className="w-full border rounded-xl px-4 py-3"
            value={project}
            onChange={e => setProject(e.target.value)}
          />
        </div>

        {/* CONTACTS */}
        <div>
          <label className="block text-sm mb-2">
            Contacts
          </label>

          <div className="space-y-2">
            {contacts.map((c, i) => (
              <div
                key={i}
                className="flex gap-2 items-center"
              >
                <select
                  className="border rounded-xl px-3 py-2 text-sm"
                  value={c.type}
                  onChange={e =>
                    updateContact(
                      i,
                      "type",
                      e.target.value as Contact["type"]
                    )
                  }
                >
                  <option>Email</option>
                  <option>Phone</option>
                  <option>WhatsApp</option>
                </select>

                <input
                  className="flex-1 border rounded-xl px-4 py-2"
                  placeholder={`Enter ${c.type}`}
                  value={c.value}
                  onChange={e =>
                    updateContact(i, "value", e.target.value)
                  }
                />

                {i === contacts.length - 1 ? (
                  <button
                    type="button"
                    onClick={addContact}
                    className="w-11 h-11 flex-shrink-0 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-900 transition"
                    title="Add contact"
                  >
                    +
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeContact(i)}
                    className="w-11 h-11 flex-shrink-0 rounded-full border text-gray-400 flex items-center justify-center text-sm hover:text-black hover:border-black transition"
                    title="Remove contact"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DATE */}
        <div>
          <label className="block text-sm mb-1">
            Project Start
          </label>
          <input
            type="date"
            className="w-full border rounded-xl px-4 py-3"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <input
          placeholder="Core business (e.g. Flower shop, SaaS, Retail)"
          className="w-full border rounded-xl px-4 py-3"
          value={business}
          onChange={e => setBusiness(e.target.value)}
        />

        <textarea
          placeholder="Internal notes / vision / context"
          rows={4}
          className="w-full border rounded-xl px-4 py-3 resize-none"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      {/* PHASES */}
      <h2 className="font-medium mt-8 mb-3">
        Work Phases
      </h2>

      <div className="space-y-4">
        {phases.map((p, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border p-4 space-y-3"
          >
            <div className="flex gap-2 items-center">
              <input
                className="flex-1 border rounded-xl px-4 py-2"
                placeholder="Phase title"
                value={p.title}
                onChange={e =>
                  updatePhase(i, "title", e.target.value)
                }
              />

              {i === phases.length - 1 ? (
                <button
                  type="button"
                  onClick={addPhase}
                  className="w-11 h-11 flex-shrink-0 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-900 transition"
                  title="Add phase"
                >
                  +
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => removePhase(i)}
                  className="w-11 h-11 flex-shrink-0 rounded-full border text-gray-400 flex items-center justify-center text-sm hover:text-black hover:border-black transition"
                  title="Remove phase"
                >
                  ✕
                </button>
              )}
            </div>

            <textarea
              rows={4}
              className="w-full border rounded-xl px-4 py-2 resize-none"
              placeholder="Phase description"
              value={p.desc}
              onChange={e =>
                updatePhase(i, "desc", e.target.value)
              }
            />

            <input
              type="number"
              min={1}
              className="w-full border rounded-xl px-4 py-2"
              placeholder="Timeline (Days)"
              value={p.days}
              onChange={e =>
                updatePhase(i, "days", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      {/* LINKS */}
      <div className="bg-white rounded-2xl border p-4 mt-8">
        <label className="block text-sm mb-2">
          References / Links
        </label>

        <div className="flex gap-2 mb-2">
          <input
            placeholder="Paste link"
            className="flex-1 border rounded-xl px-4 py-2"
            value={linkInput}
            onChange={e => setLinkInput(e.target.value)}
          />

          <button
            type="button"
            onClick={addLink}
            className="w-11 h-11 flex-shrink-0 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-900 transition"
          >
            +
          </button>
        </div>

        <div className="space-y-1">
          {links.map((l, i) => (
            <div
              key={i}
              className="flex justify-between items-center text-sm text-gray-600"
            >
              <span className="truncate">
                {l}
              </span>

              <button
                type="button"
                onClick={() => removeLink(i)}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FINANCIALS */}
      <div className="bg-white rounded-2xl border p-4 mt-8">
        <label className="block text-sm mb-2">
          Total Cost
        </label>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-xl px-4 py-2"
            value={total}
            onChange={e => setTotal(e.target.value)}
          />

          <select
            className="border rounded-xl px-3 py-2"
            value={currency}
            onChange={e =>
              setCurrency(e.target.value)
            }
          >
            <option>KWD</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>

        <h3 className="font-medium mb-2">
          Payments
        </h3>

        {payments.map((p, i) => (
          <div
            key={i}
            className="flex gap-2 mb-2 items-center"
          >
            <input
              className="flex-1 border rounded-xl px-3 py-2 min-w-0"
              placeholder="Payment title"
              value={p.title}
              onChange={e =>
                updatePayment(i, "title", e.target.value)
              }
            />

            <input
              className="w-28 border rounded-xl px-3 py-2 text-center"
              placeholder="Amount"
              value={p.amount}
              onChange={e =>
                updatePayment(i, "amount", e.target.value)
              }
            />

            <input
              type="date"
              className="w-36 border rounded-xl px-3 py-2"
              value={p.date}
              onChange={e =>
                updatePayment(i, "date", e.target.value)
              }
            />

            {i === payments.length - 1 ? (
              <button
                type="button"
                onClick={addPayment}
                className="w-11 h-11 flex-shrink-0 rounded-full bg-black text-white flex items-center justify-center text-lg hover:bg-gray-900 transition"
                title="Add payment"
              >
                +
              </button>
            ) : (
              <button
                type="button"
                onClick={() => removePayment(i)}
                className="w-11 h-11 flex-shrink-0 rounded-full border text-gray-400 flex items-center justify-center text-sm hover:text-black hover:border-black transition"
                title="Remove payment"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={createProject}
          className="w-full bg-black text-white rounded-full py-4 text-sm tracking-wide"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}