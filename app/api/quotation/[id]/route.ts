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
      "SELECT * FROM quotations WHERE id = ? LIMIT 1",
      [id]
    );
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
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
    await db.execute("DELETE FROM quotations WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
