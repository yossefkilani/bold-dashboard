"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Phase = {
  title: string;
  desc: string;
  timeline: string;
};

export default function NewQuotationPage() {
  const router = useRouter();

  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currency, setCurrency] = useState("KWD");
  const [total, setTotal] = useState("");

  const [terms, setTerms] = useState(
    `100% Advance Payment
Any additional required direct or indirect jobs will be subject to a specified quotation shared with you at the time of request.`
  );

  const [includeBankInfo, setIncludeBankInfo] = useState(false);

  const [phases, setPhases] = useState<Phase[]>([
    {
      title: "Branding Design",
      desc: `Logo Design
Visual Identity
1- Color Palette
2- Font Selection`,
      timeline: "7",
    },
  ]);

  /* ========= PHASE HELPERS ========= */
  const addPhase = () => {
    setPhases([...phases, { title: "", desc: "", timeline: "" }]);
  };

  const removePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const updatePhase = (
    index: number,
    field: keyof Phase,
    value: string
  ) => {
    const copy = [...phases];
    copy[index][field] = value;
    setPhases(copy);
  };

  /* ========= PREVIEW ========= */
  const openPreview = () => {
    const params = new URLSearchParams({
      client,
      project,
      date,
      total,
      currency,
      terms,
      bank: includeBankInfo ? "1" : "0",
      phases: JSON.stringify(phases)
    });

    window.open(
      `/quotation-static/template.html?${params.toString()}`,
      "_blank"
    );
  };
  
  /* ========= CREATE ========= */
  async function createQuotation() {
    try {
      const res = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client,
          project,
          date,
          total,
          currency,
          terms,
          bank: includeBankInfo,
          phases: JSON.stringify(phases)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Failed to create quotation");
        return;
      }

      // فتح المعاينة الرسمية
      const params = new URLSearchParams({
        client,
        project,
        date,
        total,
        currency,
        terms,
        bank: includeBankInfo ? "1" : "0",
        phases: JSON.stringify(phases)
      });

      window.open(
        `/quotation-static/template.html?${params.toString()}`,
        "_blank"
      );

      // العودة إلى القائمة
      router.push("/dashboard/quotation");
    } catch {
      alert("Server not reachable");
    }
  }
  
  return (
    <div className="max-w-xl mx-auto px-6 pb-28">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold">
          NEW QUOTATION
        </h1>
      </div>

      {/* CLIENT / PROJECT */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <label className="block text-sm mb-1">
          Client Name
        </label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />

        <label className="block text-sm mb-1">
          Project Name
        </label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />

        <label className="block text-sm mb-1">
          Date
        </label>
        <input
          type="date"
          className="w-full border rounded-lg px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* PHASES */}
      <div className="space-y-4 mb-6">
        {phases.map((phase, i) => (
          <div key={i} className="relative">
            {phases.length > 1 && (
              <button
                onClick={() => removePhase(i)}
                className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-white border text-xs text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            )}

            <input
              placeholder="Phase title"
              className="w-full border rounded-lg px-3 py-2 mb-2"
              value={phase.title}
              onChange={(e) =>
                updatePhase(i, "title", e.target.value)
              }
            />

            <textarea
              rows={5}
              className="w-full border rounded-lg px-3 py-2 mb-2 resize-none"
              value={phase.desc}
              onChange={(e) =>
                updatePhase(i, "desc", e.target.value)
              }
            />

            <input
              type="number"
              min={1}
              placeholder="Timeline (Days)"
              className="w-full border rounded-lg px-3 py-2"
              value={phase.timeline}
              onChange={(e) =>
                updatePhase(i, "timeline", e.target.value)
              }
            />
          </div>
        ))}

        <button
          onClick={addPhase}
          className="w-full border rounded-xl py-3 text-sm"
        >
          + Add Phase
        </button>
      </div>

      {/* PAYMENT TERMS */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <label className="block text-sm mb-2 font-medium">
          Payment Terms
        </label>
        <textarea
          rows={6}
          className="w-full border rounded-lg px-3 py-2 resize-none"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />
      </div>

      {/* TOTAL */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <label className="block text-sm mb-1">
          Total Cost
        </label>

        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-lg px-3 py-2"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />

          <select
            className="border rounded-lg px-3 py-2"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option>KWD</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
      </div>

      {/* BANK INFO */}
      <div className="bg-white border rounded-xl p-4 mb-8">
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={includeBankInfo}
            onChange={(e) =>
              setIncludeBankInfo(e.target.checked)
            }
          />
          Include Bank Information
        </label>
      </div>

      {/* ACTIONS */}
      <div className="actions fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">
      <button
        onClick={() => {
          console.log("PREVIEW CLICKED");
          openPreview();
        }}
        className="flex-1 border rounded-full py-3"
      >
        Preview
      </button>

       <button
         onClick={createQuotation}
         className="flex-1 bg-black text-white rounded-full py-3"
       >
         Create Quotation
       </button>
      </div>
    </div>
  );
}