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

const TERMS_AR = `يُشترط دفع 100٪ من قيمة العمل مقدمًا قبل بدء التنفيذ.
الأيام المذكورة أعلاه تُحتسب ضمن أيام العمل الرسمية للشركة، ولا يُحتسب يوم الجمعة والسبت ضمن مدة التنفيذ.
أي طلبات إضافية من العميل يتم تقديمها في عرض سعر مستقل وتُحتسب خارج نطاق الاتفاق الأساسي.
المدة الزمنية الموضحة أعلاه تُعد تقديرية، وقد تخضع للتغيير بحسب التعديلات المطلوبة أو ظروف المشروع، وذلك باتفاق الطرفين.
في حال رغب العميل في التوقف المؤقت عن المشروع أو لم يستجب لمحاولات التواصل، يحق له التوقف لمدة أقصاها شهران، وبعد هذه المدة يُعتبر المشروع ملغى تلقائيًا وغير قابل للاسترداد المالي.`;

const TERMS_EN = `Full payment of 100% is required in advance before work begins.
The timelines mentioned above are calculated in official working days; Fridays and Saturdays are not counted as working days.
Any additional requests by the client will be presented in a separate quotation and are considered outside the scope of the original agreement.
The timelines indicated above are estimates and may be subject to change based on requested revisions or project circumstances, by mutual agreement.
Should the client wish to pause the project or becomes unresponsive to communication, a pause of up to two months is permitted. After this period, the project will be considered automatically cancelled with no financial refund.`;

const TERMS_100 = TERMS_AR;
const TERMS_50 = TERMS_AR;

const VI = `Logo Design
Visual Identity
1- Color Palette
2- Typography`;

const SECTOR_TEMPLATES: Record<string, Template> = {

  // ─── FOOD & BEVERAGE ───────────────────────────────────────────────
  "coffee-shop": {
    label: "Coffee Shop",
    total: "800",
    currency: "KWD",
    terms: TERMS_50,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Hot Beverage Cups
Cold Beverage Cups
Ice Cream Cup
Sweet Box
Pastry Box
Wax Paper
Cup Holder
Sandwich Bag
Delivery Bags S / M / L
Uniform — Apron & T-shirt`,
        timeline: "14",
      },
    ],
  },

  "cafe-resto": {
    label: "Cafe & Restaurant",
    total: "950",
    currency: "KWD",
    terms: TERMS_50,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Packaging & Print Design",
        desc: `Burger Box
Fries Tray
Hot Beverage Cups
Cold Beverage Cups
Ice Cream Cup
Pastry Box
Sandwich Bag
Delivery Bags S / M / L
Wax Paper
Cup Holder
Uniform — Apron & T-shirt
Delivery Car Wrap`,
        timeline: "14",
      },
    ],
  },

  "bakery": {
    label: "Bakery",
    total: "450",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Box Design
Cup Design
Paper Bag
Wax Paper
Sticker Design`,
        timeline: "10",
      },
    ],
  },

  "burger-restaurant": {
    label: "Burger Restaurant",
    total: "750",
    currency: "KWD",
    terms: TERMS_50,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Burger Box
Fries Box / Tray
Cold Beverage Cups
Sandwich Bag
Delivery Bags S / M / L
Wax Paper
Uniform — Apron & T-shirt`,
        timeline: "14",
      },
    ],
  },

  "sweet-candy": {
    label: "Sweet / Candy Brand",
    total: "350",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Box Design
Box with Plate
Cup Design
Bag Design`,
        timeline: "7",
      },
    ],
  },

  "catering": {
    label: "Catering Brand",
    total: "700",
    currency: "KWD",
    terms: TERMS_50,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Packaging & Print Design",
        desc: `Hot Meal Box
Cold Meal Box
Cutlery Kit
Bag Design S / M / L
Wax Paper
Uniform Design
Delivery Car Wrap`,
        timeline: "14",
      },
    ],
  },

  // ─── FASHION & LIFESTYLE ──────────────────────────────────────────
  "clothing-brand": {
    label: "Clothing Brand",
    total: "450",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
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
    label: "Abaya / Modest Fashion",
    total: "450",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Name Creation",
        desc: `Brand Name (Arabic & English)`,
        timeline: "5",
      },
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
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
        desc: VI,
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
    label: "Perfume / Fragrance Brand",
    total: "450",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Perfume Box
Spray Box
Set Box
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
        desc: VI,
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

  "salon-beauty": {
    label: "Salon / Beauty Brand",
    total: "500",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Stationery & Packaging",
        desc: `Business Card
Gift Card
Product Label Design
Paper Bag
Wax Paper
Uniform Design`,
        timeline: "10",
      },
    ],
  },

  "flowers-brand": {
    label: "Flowers / Gift Brand",
    total: "400",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Packaging Design",
        desc: `Box Design
Wrapping Paper
Ribbon Tag
Bag Design
Sticker Design`,
        timeline: "7",
      },
    ],
  },

  // ─── BUSINESS & CORPORATE ─────────────────────────────────────────
  "real-estate": {
    label: "Real Estate / Corporate",
    total: "900",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Typography (Arabic & English)`,
        timeline: "14",
      },
      {
        title: "Stationery & Collaterals",
        desc: `Business Card
Letterhead
DL Envelope
A4 Envelope
Notebook Cover
Folder Design
Email Signature`,
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
    label: "Clinic / Medical",
    total: "600",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: `Logo Design
Visual Identity
1- Color Palette
2- Typography (Arabic & English)`,
        timeline: "14",
      },
      {
        title: "Stationery Design",
        desc: `Business Card
Letterhead
Prescription Pad
Appointment Card
Uniform Design`,
        timeline: "10",
      },
    ],
  },

  "laundry-tailor": {
    label: "Laundry / Tailoring",
    total: "400",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Print & Packaging",
        desc: `Garment Bag Design
Tag Design
Sticker Design
Business Card
Uniform Design`,
        timeline: "7",
      },
    ],
  },

  "car-services": {
    label: "Car Services / Auto",
    total: "500",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Stationery & Vehicle Branding",
        desc: `Business Card
Letterhead
Invoice Design
Car Wrap Design
Uniform Design`,
        timeline: "10",
      },
    ],
  },

  "sports-brand": {
    label: "Sports / Activewear Brand",
    total: "500",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
        timeline: "14",
      },
      {
        title: "Packaging & Apparel Design",
        desc: `Box Design
Paper Bag
Tag Design
Sticker Design
Jersey / Uniform Design`,
        timeline: "10",
      },
    ],
  },

  // ─── BRANDING PACKAGES ────────────────────────────────────────────
  "basic-branding": {
    label: "Basic Branding Package",
    total: "300",
    currency: "KWD",
    terms: TERMS_100,
    phases: [
      {
        title: "Logo Design & Visual Identity",
        desc: VI,
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
        desc: VI,
        timeline: "14",
      },
      {
        title: "Stationery Design",
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
        title: "Logo Redesign & Visual Identity",
        desc: `Logo Redesign
Visual Identity Update
1- Color Palette
2- Typography`,
        timeline: "14",
      },
      {
        title: "Collaterals Update",
        desc: `Updated Packaging / Stationery as per agreed scope`,
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
  const [termsLang, setTermsLang] = useState<"ar" | "en">("ar");
  const [terms, setTerms] = useState(TERMS_AR);
  const [includeBankInfo, setIncludeBankInfo] = useState(false);

  function toggleTermsLang() {
    const next = termsLang === "ar" ? "en" : "ar";
    setTermsLang(next);
    setTerms(next === "ar" ? TERMS_AR : TERMS_EN);
  }
  const [phases, setPhases] = useState<Phase[]>([
    { title: "Logo Design & Visual Identity", desc: VI, timeline: "14" },
  ]);

  function applySectorTemplate(key: string) {
    setSelectedSector(key);
    if (!key) return;
    const t = SECTOR_TEMPLATES[key];
    setTotal(t.total);
    setCurrency(t.currency);
    setTerms(t.terms);
    setPhases(t.phases.map((p) => ({ ...p })));
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
            <option value="coffee-shop">Coffee Shop</option>
            <option value="cafe-resto">Cafe & Restaurant</option>
            <option value="bakery">Bakery</option>
            <option value="burger-restaurant">Burger Restaurant</option>
            <option value="sweet-candy">Sweet / Candy Brand</option>
            <option value="catering">Catering Brand</option>
          </optgroup>
          <optgroup label="Fashion & Lifestyle">
            <option value="clothing-brand">Clothing Brand</option>
            <option value="abaya-brand">Abaya / Modest Fashion</option>
            <option value="jewelry-brand">Jewelry Brand</option>
            <option value="perfume-brand">Perfume / Fragrance Brand</option>
            <option value="eyewear-brand">Eyewear Brand</option>
            <option value="salon-beauty">Salon / Beauty Brand</option>
            <option value="flowers-brand">Flowers / Gift Brand</option>
            <option value="sports-brand">Sports / Activewear Brand</option>
          </optgroup>
          <optgroup label="Business & Services">
            <option value="real-estate">Real Estate / Corporate</option>
            <option value="clinic-medical">Clinic / Medical</option>
            <option value="laundry-tailor">Laundry / Tailoring</option>
            <option value="car-services">Car Services / Auto</option>
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
            <input className={`${inputCls} mb-3`} value={phase.title} onChange={(e) => updatePhase(i, "title", e.target.value)} />
            <label className="block text-xs text-gray-500 mb-1">Deliverables</label>
            <textarea rows={6} className={`${inputCls} resize-none mb-3`} value={phase.desc} onChange={(e) => updatePhase(i, "desc", e.target.value)} />
            <label className="block text-xs text-gray-500 mb-1">Timeline (Days)</label>
            <input type="number" min={1} className={inputCls} value={phase.timeline} onChange={(e) => updatePhase(i, "timeline", e.target.value)} />
          </div>
        ))}
        <button onClick={addPhase} className="w-full border rounded-xl py-3 text-sm hover:bg-gray-50">+ Add Phase</button>
      </div>

      {/* PAYMENT TERMS */}
      <div className="bg-white border rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {termsLang === "ar" ? "الشروط والأحكام" : "Payment Terms"}
          </label>
          <button
            type="button"
            onClick={toggleTermsLang}
            className="flex items-center gap-1.5 text-xs border rounded-full px-3 py-1 hover:bg-gray-50 transition"
          >
            <span className={termsLang === "ar" ? "font-bold" : "text-gray-400"}>AR</span>
            <span className="text-gray-300">|</span>
            <span className={termsLang === "en" ? "font-bold" : "text-gray-400"}>EN</span>
          </button>
        </div>
        <textarea
          rows={7}
          dir={termsLang === "ar" ? "rtl" : "ltr"}
          className={`${inputCls} resize-none`}
          style={{ fontFamily: termsLang === "ar" ? "Arial, sans-serif" : "inherit" }}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />
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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button onClick={createQuotation} className="w-full bg-black text-white rounded-full py-4 text-sm font-medium">
          Create Quotation
        </button>
      </div>
    </div>
  );
}
