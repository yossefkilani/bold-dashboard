export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();
    const [[row]]: any = await db.execute(
      "SELECT * FROM cases WHERE id = ? LIMIT 1",
      [id]
    );
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();
    const body = await req.json();
    const { title, slug, industry, short_description, full_description, cover_image, hero_image, gallery } = body;

    await db.execute(
      `UPDATE cases SET title=?, slug=?, industry=?, short_description=?, full_description=?, cover_image=?, hero_image=?, gallery=?
       WHERE id = ?`,
      [title, slug, industry, short_description, full_description, cover_image, hero_image, JSON.stringify(gallery || []), id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();
    await db.execute("DELETE FROM cases WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
