export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await openDB();
    const [rows]: any = await db.execute(
      "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("NOTIFICATIONS GET ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
