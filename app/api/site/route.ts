export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

/* ======================
   GET — LOAD SITE DATA
====================== */
export async function GET() {
  try {
    const db = await openDB();

    // تأكد أن الجدول موجود
    await db.exec(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY,
        hero_title TEXT,
        hero_subtitle TEXT,
        hero_image TEXT,
        about_text TEXT,
        contact_email TEXT,
        contact_phone TEXT
      )
    `);

    const row = await db.get(
      "SELECT * FROM site_settings WHERE id = 1"
    );

    return NextResponse.json(
      row || {
        hero_title: "",
        hero_subtitle: "",
        hero_image: "",
        about_text: "",
        contact_email: "",
        contact_phone: ""
      }
    );

  } catch (err) {
    console.error("SITE GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load site data" },
      { status: 500 }
    );
  }
}

/* ======================
   PUT — SAVE SITE DATA
====================== */
export async function PUT(req: Request) {
  try {
    const db = await openDB();
    const body = await req.json();

    await db.exec(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY,
        hero_title TEXT,
        hero_subtitle TEXT,
        hero_image TEXT,
        about_text TEXT,
        contact_email TEXT,
        contact_phone TEXT
      )
    `);

    // نحفظ دائماً في ID = 1
    await db.run(
      `
      INSERT INTO site_settings (
        id,
        hero_title,
        hero_subtitle,
        hero_image,
        about_text,
        contact_email,
        contact_phone
      )
      VALUES (1, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        hero_title = excluded.hero_title,
        hero_subtitle = excluded.hero_subtitle,
        hero_image = excluded.hero_image,
        about_text = excluded.about_text,
        contact_email = excluded.contact_email,
        contact_phone = excluded.contact_phone
      `,
      [
        body.hero_title,
        body.hero_subtitle,
        body.hero_image,
        body.about_text,
        body.contact_email,
        body.contact_phone
      ]
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("SITE PUT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save site data" },
      { status: 500 }
    );
  }
}