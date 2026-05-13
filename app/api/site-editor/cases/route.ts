export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await openDB();
    const [rows]: any = await db.execute(
      "SELECT * FROM cases ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await openDB();
    const body = await req.json();
    const { title, slug, industry, short_description, full_description, cover_image, hero_image, gallery } = body;

    const [result]: any = await db.execute(
      `INSERT INTO cases (title, slug, industry, short_description, full_description, cover_image, hero_image, gallery, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [title, slug, industry, short_description, full_description, cover_image, hero_image, JSON.stringify(gallery || [])]
    );

    return NextResponse.json({ ok: true, id: result.insertId });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
