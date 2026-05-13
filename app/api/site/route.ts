export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const db = await openDB();

    const [[heroRow]]: any = await db.execute(
      "SELECT value FROM site_settings WHERE key_name = 'hero' LIMIT 1"
    );
    const hero = heroRow ? JSON.parse(heroRow.value || "{}") : {};

    const [cases]: any = await db.execute(
      "SELECT * FROM cases ORDER BY position ASC, created_at DESC"
    );

    return NextResponse.json({ hero, cases }, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500, headers: CORS });
  }
}
