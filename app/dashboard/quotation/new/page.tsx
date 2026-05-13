"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Phase = {
  title: string;
  desc: string;
  timeline: string;
};

type Template = {
  label: string;
  total: string;
  currency: string;
  terms: string;
  phases: Phase[];
};

const TERMS_100 = `100% Advance Payment
Any additional required direct or indirect jobs will be subject to a specified quotation shared with you at the time of request.`;

const TERMS_50 = `50% advance payment and 50% on completion.
Any additional required direct or indirect jobs will be subject to a specified quotation shared with you at the time of request.`;

const SECTOR_TEMPLATES: Record<string, Template> = {
  "coffee-shop": {
    label: "Coffee Shop Branding",
    total: "800",
    currency: "KWD",
    terms: TERMS_50,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Brand Style (Theme)
3- Typography`,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Coffee Cups - Hot Beverages
Cups - Cold Beverages
Ice Cream Cup
Pastry Box
Sweet Box
Wax Paper
Cups Holder
Sandwiches Bag
Delivery Bags S/M/L
Uniform - Apron / T-shirt`,
        timeline: "14",
      },
    ],
  },

  "cafe-resto": {
    label: "Cafe & Restaurant Branding",
    total: "950",
    currency: "KWD",
    terms: TERMS_50,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Brand Style (Theme)
3- Typography
Basic Brand Guidelines`,
        timeline: "14",
      },
      {
        title: "Packaging & Print Design",
        desc: `Burger Box
Fries Tray
Coffee Cups - Hot Beverages
Cups - Cold Beverages
Ice Cream Cup
Pastry Box
Sandwiches Bag
Delivery Bags S/M/L
Wax Paper
Cups Holder
Uniform - Apron / T-shirt
Delivery Car Wrap`,
        timeline: "14",
      },
    ],
  },

  "bakery": {
    label: "Bakery / Sweet Shop Branding",
    total: "450",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection`,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Box Design
Cup Design
Box with Plate
Paper Bag Design`,
        timeline: "7",
      },
    ],
  },

  "sweet-brand": {
    label: "Sweet / Candy Brand",
    total: "350",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection`,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Cup Design
Box Design
Box with Plate
Bag Design`,
        timeline: "7",
      },
    ],
  },

  "clothing-brand": {
    label: "Clothing Brand",
    total: "450",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection`,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Box Design
Paper Bag
Wax Paper
Card Design
Tag Design`,
        timeline: "10",
      },
    ],
  },

  "abaya-brand": {
    label: "Abaya / Fashion Brand",
    total: "450",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Name Creation",
        desc: `Brand Name Creation (Arabic & English)`,
        timeline: "5",
      },
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection`,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Box Design
Paper Bag
Wax Paper
Card Design`,
        timeline: "10",
      },
    ],
  },

  "jewelry-brand": {
    label: "Jewelry Brand",
    total: "400",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection`,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Box Design
Gift Box
Wax Paper
Bag Design`,
        timeline: "7",
      },
    ],
  },

  "perfume-brand": {
    label: "Perfume Brand",
    total: "450",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection`,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Perfume Box Design
Spray Box
Set Box Design
Bag Design
Sticker Design`,
        timeline: "14",
      },
    ],
  },

  "eyewear-brand": {
    label: "Eyewear Brand",
    total: "450",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection`,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Product Box
Eyewear Case
Label Design
Bag Design`,
        timeline: "7",
      },
    ],
  },

  "real-estate": {
    label: "Real Estate / Corporate Branding",
    total: "900",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection (Arabic & English)`,
        timeline: "14",
      },
      {
        title: "Stationery & Digital Collaterals",
        desc: `Business Card
Letterhead
DL Envelope
A4 Envelope
Notebook
Folder
Email Signature
Website Design (Landing Page - Visual Layout)
Presentation Template (5 slides)
Social Media Template (Feed & Story)`,
        timeline: "14",
      },
      {
        title: "Brand Guidelines",
        desc: `Full Brand Guidelines Document`,
        timeline: "7",
      },
    ],
  },

  "clinic-medical": {
    label: "Clinic / Medical Branding",
    total: "600",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection (Arabic & English)`,
        timeline: "14",
      },
      {
        title: "Stationery Design",
        desc: `Business Card
Letterhead
Prescription Pad
Appointment Card
Staff Uniform Design`,
        timeline: "10",
      },
    ],
  },

  "social-media": {
    label: "Social Media Management",
    total: "450",
    currency: "KWD",
    terms: `Payment in advance at the beginning of each month.
In case either party wishes to cancel the contract, the other party must be notified one month in advance.`,
    phases: [
      {
        title: "Monthly Social Media Package",
        desc: `Social Media Account Management
Post Scheduling
9 Post Designs
Story Designs (aligned with local & global occasions)
12 Videos/Month (2 photography sessions)`,
        timeline: "30",
      },
    ],
  },

  "basic-branding": {
    label: "Basic Branding Package",
    total: "300",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Fonts Selection`,
        timeline: "14",
      },
    ],
  },

  "full-branding": {
    label: "Full Branding Package",
    total: "700",
    currency: "KWD",
    terms: TERMS_50,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Brand Style (Theme)
3- Typography`,
        timeline: "14",
      },
      {
        title: "Stationery & Collaterals",
        desc: `Business Card
Letterhead
Envelope Design
Folder Design`,
        timeline: "10",
      },
      {
        title: "Brand Guidelines",
        desc: `Full Brand Guidelines Document`,
        timeline: "7",
      },
    ],
  },

  "rebranding": {
    label: "Rebranding",
    total: "600",
    currency: "KWD",
    terms: TERMS_50,
    phases: [
      {
        title: "Brand Strategy & Logo Redesign",
        desc: `Brand Audit
Logo Redesign
Visual Identity Update
1- Color Palette
2- Typography`,
        timeline: "14",
      },
      {
        title: "Collaterals Update",
        desc: `Updated Packaging / Stationery as per brand scope`,
        timeline: "14",
      },
    ],
  },
};

export default function NewQuotationPage() {
  const router = useRouter();

  const [selectedSector, setSelectedSector] = useState("");
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currency, setCurrency] = useState("KWD");
  const [total, setTotal] = useState("");
  const [terms, setTerms] = useState(TERMS_100);
  const [includeBankInfo, setIncludeBankInfo] = useState(false);
  const [phases, setPhases] = useState<Phase[]>([
    { title: "Branding Design", desc: `Logo Design\nVisual Identity\n1- Color Palette\n2- Font Selection`, timeline: "7" },
  ]);

  function applySectorTemplate(key: string) {
    setSelectedSector(key);
    if (!key) return;
    const t = SECTOR_TEMPLATES[key];
    setTotal(t.total);
    setCurrency(t.currency);
    setTerms(t.terms);
    setPhases(t.phases.map(p => ({ ...p })));
  }

  const addPhase = () => setPhases([...phases, { title: "", desc: "", timeline: "" }]);
  const removePhase = (i: number) => setPhases(phases.filter((_, x) => x !== i));
  const updatePhase = (i: number, field: keyof Phase, value: string) => {
    const copy = [...phases];
    copy[i][field] = value;
    setPhases(copy);
  };

  async function createQuotation() {
    try {
      const res = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client, project, date, total, currency, terms, bank: includeBankInfo, phases: JSON.stringify(phases) }),
      });

      if (!res.ok) { alert("Failed to create quotation"); return; }

      const params = new URLSearchParams({
        client, project, date, total, currency, terms,
        bank: includeBankInfo ? "1" : "0",
        phases: JSON.stringify(phases),
      });

      window.open(`/quotation-static/template.html?${params.toString()}`, "_blank");
      router.push("/dashboard/quotation");
    } catch {
      alert("Server not reachable");
    }
  }

  const inputCls = "w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-black";

  return (
    <div className="max-w-xl mx-auto px-6 pb-28">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-600">← Back</button>
        <h1 className="text-2xl font-semibold">NEW QUOTATION</h1>
      </div>

      {/* SECTOR TEMPLATE */}
      <div className="bg-white border rounded-xl p-4 mb-5">
        <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Quick Template</label>
        <select
          className={`${inputCls} bg-white`}
          value={selectedSector}
          onChange={(e) => applySectorTemplate(e.target.value)}
        >
          <option value="">— Select a sector to auto-fill —</option>
          <optgroup label="Food & Beverage">
            <option value="coffee-shop">Coffee Shop Branding</option>
            <option value="cafe-resto">Cafe & Restaurant Branding</option>
            <option value="bakery">Bakery / Sweet Shop Branding</option>
            <option value="sweet-brand">Sweet / Candy Brand</option>
          </optgroup>
          <optgroup label="Fashion & Lifestyle">
            <option value="clothing-brand">Clothing Brand</option>
            <option value="abaya-brand">Abaya / Fashion Brand</option>
            <option value="jewelry-brand">Jewelry Brand</option>
            <option value="eyewear-brand">Eyewear Brand</option>
            <option value="perfume-brand">Perfume Brand</option>
          </optgroup>
          <optgroup label="Business & Corporate">
            <option value="real-estate">Real Estate / Corporate Branding</option>
            <option value="clinic-medical">Clinic / Medical Branding</option>
            <option value="social-media">Social Media Management</option>
          </optgroup>
          <optgroup label="Branding Packages">
            <option value="basic-branding">Basic Branding Package</option>
            <option value="full-branding">Full Branding Package</option>
            <option value="rebranding">Rebranding</option>
          </optgroup>
        </select>
        {selectedSector && (
          <p className="text-xs text-green-600 mt-2">✓ Template applied — you can edit any field below</p>
        )}
      </div>

      {/* CLIENT / PROJECT */}
      <div className="bg-white border rounded-xl p-4 mb-5 space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Client Name</label>
          <input className={inputCls} value={client} onChange={(e) => setClient(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Project Name</label>
          <input className={inputCls} value={project} onChange={(e) => setProject(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Date</label>
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      {/* PHASES */}
      <div className="space-y-4 mb-5">
        {phases.map((phase, i) => (
          <div key={i} className="bg-white border rounded-xl p-4 relative">
            {phases.length > 1 && (
              <button onClick={() => removePhase(i)} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-500 hover:bg-red-100 hover:text-red-500">✕</button>
            )}
            <label className="block text-xs text-gray-500 mb-1">Phase {i + 1} Title</label>
            <input placeholder="Phase title" className={`${inputCls} mb-3`} value={phase.title} onChange={(e) => updatePhase(i, "title", e.target.value)} />
            <label className="block text-xs text-gray-500 mb-1">Deliverables</label>
            <textarea rows={5} className={`${inputCls} resize-none mb-3`} value={phase.desc} onChange={(e) => updatePhase(i, "desc", e.target.value)} />
            <label className="block text-xs text-gray-500 mb-1">Timeline (Days)</label>
            <input type="number" min={1} className={inputCls} value={phase.timeline} onChange={(e) => updatePhase(i, "timeline", e.target.value)} />
          </div>
        ))}
        <button onClick={addPhase} className="w-full border rounded-xl py-3 text-sm hover:bg-gray-50">+ Add Phase</button>
      </div>

      {/* PAYMENT TERMS */}
      <div className="bg-white border rounded-xl p-4 mb-5">
        <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Payment Terms</label>
        <textarea rows={4} className={`${inputCls} resize-none`} value={terms} onChange={(e) => setTerms(e.target.value)} />
      </div>

      {/* TOTAL */}
      <div className="bg-white border rounded-xl p-4 mb-5">
        <label className="block text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Total Cost</label>
        <div className="flex gap-2">
          <input className={`${inputCls} flex-1`} value={total} onChange={(e) => setTotal(e.target.value)} placeholder="0" />
          <select className="border rounded-xl px-3 py-3 text-sm outline-none focus:border-black" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option>KWD</option>
            <option>USD</option>
            <option>EUR</option>
            <option>SAR</option>
            <option>AED</option>
          </select>
        </div>
      </div>

      {/* BANK INFO */}
      <div className="bg-white border rounded-xl p-4 mb-8">
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input type="checkbox" checked={includeBankInfo} onChange={(e) => setIncludeBankInfo(e.target.checked)} />
          Include Bank Information
        </label>
      </div>

      {/* ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button onClick={createQuotation} className="w-full bg-black text-white rounded-full py-4 text-sm font-medium">
          Create Quotation
        </button>
      </div>
    </div>
  );
}
