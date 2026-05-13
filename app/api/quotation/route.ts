export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await openDB();
    const [rows]: any = await db.execute(
      "SELECT * FROM quotations ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("QUOTATION GET ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await openDB();
    const body = await req.json();

    const [result]: any = await db.execute(
      `INSERT INTO quotations (client, project, date, total, currency, terms, bank, phases, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', NOW())`,
      [
        body.client || "",
        body.project || "",
        body.date || null,
        body.total || "",
        body.currency || "KWD",
        body.terms || "",
        body.bank ? 1 : 0,
        typeof body.phases === "string" ? body.phases : JSON.stringify(body.phases || []),
      ]
    );

    return NextResponse.json({ id: result.insertId });
  } catch (err) {
    console.error("QUOTATION POST ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
