export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await openDB();
    const [[row]]: any = await db.execute(
      "SELECT value FROM site_settings WHERE key_name = 'hero' LIMIT 1"
    );
    const data = row ? JSON.parse(row.value || "{}") : {};
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await openDB();
    const body = await req.json();
    const value = JSON.stringify(body);

    await db.execute(
      `INSERT INTO site_settings (key_name, value) VALUES ('hero', ?)
       ON DUPLICATE KEY UPDATE value = ?, updated_at = NOW()`,
      [value, value]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
