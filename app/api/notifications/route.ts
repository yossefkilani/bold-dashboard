export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function GET() {
  const db = await openDB();

  const rows = await db.execute(`
    SELECT *
    FROM notifications
    ORDER BY created_at DESC
  `);

  return NextResponse.json(rows);
}