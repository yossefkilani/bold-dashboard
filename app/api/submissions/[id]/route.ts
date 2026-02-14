import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

/* ======================
   GET SINGLE
====================== */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await openDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM submissions WHERE id = ?",
    [params.id]
  );

  const data = rows?.[0];

  if (!data) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

/* ======================
   DELETE
====================== */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await openDB();

  await db.execute(
    "DELETE FROM submissions WHERE id = ?",
    [params.id]
  );

  return NextResponse.json({ ok: true });
}