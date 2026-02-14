export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

/* ======================
   GET — SINGLE
====================== */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();

    const row = await db.get(
      "SELECT * FROM submissions WHERE id = ?",
      id
    );

    if (!row) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(row);

  } catch (err) {
    console.error("GET SINGLE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load submission" },
      { status: 500 }
    );
  }
}

/* ======================
   DELETE
====================== */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();

    await db.run(
      `DELETE FROM submissions WHERE id = ?`,
      id
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}