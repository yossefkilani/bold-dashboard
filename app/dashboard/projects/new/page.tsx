"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

type Phase = { title: string; desc: string; days: string };
type Payment = { title: string; amount: string; date: string };
type Contact = { type: "Email" | "Phone" | "WhatsApp"; value: string };

function CreateProjectForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [client, setClient] = useState(params.get("client") || "");
  const [project, setProject] = useState(params.get("project") || "");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [business, setBusiness] = useState(params.get("business") || "");
  const [notes, setNotes] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([
    { type: "Phone", value: params.get("phone") || "" },
  ]);
  const [phases, setPhases] = useState<Phase[]>([
    { title: "Branding Design", desc: "Logo Design\nVisual Identity\n1- Color Palette\n2- Font Selection", days: "7" },
  ]);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [currency, setCurrency] = useState("KWD");
  const [total, setTotal] = useState("");
  const [payments, setPayments] = useState<Payment[]>([
    { title: "First Payment", amount: "", date: new Date().toISOString().split("T")[0] },
  ]);

  function addContact() {
    setContacts([...contacts, { type: "Email", value: "" }]);
  }
  function updateContact(i: number, field: keyof Contact, v: string) {
    const c = [...contacts];
    (c[i] as any)[field] = v;
    setContacts(c);
  }
  function removeContact(i: number) { setContacts(contacts.filter((_, x) => x !== i)); }

  function addPhase() { setPhases([...phases, { title: "", desc: "", days: "" }]); }
  function updatePhase(i: number, f: keyof Phase, v: string) {
    const p = [...phases]; p[i][f] = v; setPhases(p);
  }
  function removePhase(i: number) { setPhases(phases.filter((_, x) => x !== i)); }

  function addLink() {
    if (!linkInput.trim()) return;
    setLinks([...links, linkInput.trim()]);
    setLinkInput("");
  }
  function removeLink(i: number) { setLinks(links.filter((_, x) => x !== i)); }

  function addPayment() {
    setPayments([...payments, { title: "Payment", amount: "", date: startDate }]);
  }
  function updatePayment(i: number, f: keyof Payment, v: string) {
    const p = [...payments]; p[i][f] = v; setPayments(p);
  }
  function removePayment(i: number) { setPayments(payments.filter((_, x) => x !== i)); }

  async function createProject() {
    if (!client || !project) { alert("Fill client and project name"); return; }

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client, project, contacts, startDate, business, notes, phases, links, total, currency, payments }),
    });

    const data = await res.json();
    if (!res.ok) { alert("Failed to create project"); return; }
    router.push(`/dashboard/projects/${data.projectId}`);
  }

  const inputCls = "w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-black";

  return (
    <div className="max-w-xl mx-auto pb-32">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500">← Back</button>
        <h1 className="text-2xl font-semibold">Create New Project</h1>
      </div>

      <div className="bg-white rounded-2xl border p-5 space-y-4">
        <div>
          <label className="block text-sm mb-1">Client Name *</label>
          <input className={inputCls} value={client} onChange={(e) => setClient(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Project Name *</label>
          <input className={inputCls} value={project} onChange={(e) => setProject(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm mb-2">Contacts</label>
          <div className="space-y-2">
            {contacts.map((c, i) => (
              <div key={i} className="flex gap-2">
                <select
                  className="border rounded-xl px-3 py-2 text-sm"
                  value={c.type}
                  onChange={(e) => updateContact(i, "type", e.target.value as Contact["type"])}
                >
                  <option>Email</option>
                  <option>Phone</option>
                  <option>WhatsApp</option>
                </select>
                <input
                  className="flex-1 border rounded-xl px-3 py-2 text-sm"
                  value={c.value}
                  onChange={(e) => updateContact(i, "value", e.target.value)}
                />
                {contacts.length > 1 && (
                  <button onClick={() => removeContact(i)} className="px-3 text-gray-400 hover:text-red-500">✕</button>
                )}
              </div>
            ))}
            <button onClick={addContact} className="text-sm text-gray-500 hover:text-black">+ Add contact</button>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <input className={inputCls} placeholder="Business sector" value={business} onChange={(e) => setBusiness(e.target.value)} />
        <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Internal notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <h2 className="font-medium mt-8 mb-3">Work Phases</h2>
      <div className="space-y-3">
        {phases.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl border p-4 space-y-2">
            <div className="flex gap-2">
              <input className="flex-1 border rounded-xl px-3 py-2 text-sm" placeholder="Phase title" value={p.title} onChange={(e) => updatePhase(i, "title", e.target.value)} />
              {phases.length > 1 && (
                <button onClick={() => removePhase(i)} className="text-gray-400 hover:text-red-500 px-2">✕</button>
              )}
            </div>
            <textarea rows={3} className="w-full border rounded-xl px-3 py-2 text-sm resize-none" placeholder="Description" value={p.desc} onChange={(e) => updatePhase(i, "desc", e.target.value)} />
            <input type="number" min={1} className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="Timeline (days)" value={p.days} onChange={(e) => updatePhase(i, "days", e.target.value)} />
          </div>
        ))}
        <button onClick={addPhase} className="text-sm text-gray-500 hover:text-black">+ Add phase</button>
      </div>

      <div className="bg-white rounded-2xl border p-4 mt-6">
        <label className="block text-sm mb-2">References / Links</label>
        <div className="flex gap-2 mb-2">
          <input className="flex-1 border rounded-xl px-3 py-2 text-sm" placeholder="Paste link" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLink()} />
          <button onClick={addLink} className="bg-black text-white px-4 rounded-xl text-sm">+</button>
        </div>
        {links.map((l, i) => (
          <div key={i} className="flex justify-between text-sm text-gray-600 py-1">
            <span className="truncate">{l}</span>
            <button onClick={() => removeLink(i)} className="text-gray-400 hover:text-red-500 ml-2">✕</button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border p-4 mt-4">
        <label className="block text-sm mb-2">Total Cost</label>
        <div className="flex gap-2 mb-4">
          <input className="flex-1 border rounded-xl px-3 py-2 text-sm" value={total} onChange={(e) => setTotal(e.target.value)} />
          <select className="border rounded-xl px-3 py-2 text-sm" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option>KWD</option><option>USD</option><option>EUR</option>
          </select>
        </div>
        <h3 className="font-medium text-sm mb-2">Payments</h3>
        {payments.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className="flex-1 border rounded-xl px-3 py-2 text-sm min-w-0" placeholder="Title" value={p.title} onChange={(e) => updatePayment(i, "title", e.target.value)} />
            <input className="w-28 border rounded-xl px-3 py-2 text-sm text-center" placeholder="Amount" value={p.amount} onChange={(e) => updatePayment(i, "amount", e.target.value)} />
            <input type="date" className="w-36 border rounded-xl px-3 py-2 text-sm" value={p.date} onChange={(e) => updatePayment(i, "date", e.target.value)} />
            {payments.length > 1 && (
              <button onClick={() => removePayment(i)} className="text-gray-400 hover:text-red-500">✕</button>
            )}
          </div>
        ))}
        <button onClick={addPayment} className="text-sm text-gray-500 hover:text-black">+ Add payment</button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button onClick={createProject} className="w-full bg-black text-white rounded-full py-4 text-sm font-medium">
          Create Project
        </button>
      </div>
    </div>
  );
}

export default function CreateProjectPage() {
  return (
    <Suspense>
      <CreateProjectForm />
    </Suspense>
  );
}
