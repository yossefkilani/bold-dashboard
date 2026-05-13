export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();

    await db.execute(
      "UPDATE notifications SET is_read = 1 WHERE id = ?",
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("NOTIFICATION PATCH ERROR:", err);
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
    await db.execute("DELETE FROM notifications WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("NOTIFICATION DELETE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
