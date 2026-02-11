export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function PATCH(
  _req: Request,
  context: any
) {
  const { id } = await context.params;

  const db = await openDB();

  await db.run(
    `UPDATE notifications
     SET is_read = 1
     WHERE id = ?`,
    id
  );

  return NextResponse.json({ success: true });
}