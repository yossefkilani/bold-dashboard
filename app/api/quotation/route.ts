import { NextResponse } from "next/server";

type Quotation = {
  id: string;
  client: string;
  project: string;
  date: string;
  total: string;
  currency: string;
  terms: string;
  bank: boolean;
  phases: string;
  status: string;
  created_at: string;
};

const store: Map<string, Quotation> =
  (globalThis as any).__QUOTATION_STORE__ ??
  new Map<string, Quotation>();

(globalThis as any).__QUOTATION_STORE__ = store;

export async function POST(req: Request) {
  const data = await req.json();
  const id = crypto.randomUUID();

  const quotation: Quotation = {
    id,
    client: data.client || "",
    project: data.project || "",
    date: data.date || "",
    total: data.total || "",
    currency: data.currency || "KWD",
    terms: data.terms || "",
    bank: !!data.bank,
    phases: data.phases || "[]",
    status: "new",
    created_at: new Date().toISOString()
  };

  store.set(id, quotation);

  return NextResponse.json({ id });
}

export async function GET() {
  return NextResponse.json([...store.values()]);
}