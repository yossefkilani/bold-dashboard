export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const db = await openDB();

    await db.run(
      `
      UPDATE notifications
      SET is_read = 1
      WHERE id = ?
      `,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NOTIFICATION PATCH ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}