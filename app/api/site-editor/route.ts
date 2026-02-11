export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

/* ======================
   GET
====================== */
export async function GET() {
  try {
    const db = await openDB();

    const row = await db.get(
      "SELECT * FROM site_settings LIMIT 1"
    );

    return NextResponse.json(row || {});
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

/* ======================
   POST
====================== */
export async function POST(req: Request) {
  try {
    const db = await openDB();
    const body = await req.json();

    const {
      hero_slider,
      hero_cta_title,
      hero_cta_link,
    } = body;

    const existing = await db.get(
      "SELECT id FROM site_settings LIMIT 1"
    );

    if (existing) {
      await db.run(
        `
        UPDATE site_settings
        SET hero_slider = ?,
            hero_cta_title = ?,
            hero_cta_link = ?
        WHERE id = ?
        `,
        [
          JSON.stringify(hero_slider),
          hero_cta_title,
          hero_cta_link,
          existing.id,
        ]
      );
    } else {
      await db.run(
        `
        INSERT INTO site_settings
        (hero_slider, hero_cta_title, hero_cta_link)
        VALUES (?, ?, ?)
        `,
        [
          JSON.stringify(hero_slider),
          hero_cta_title,
          hero_cta_link,
        ]
      );
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}