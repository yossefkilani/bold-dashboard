export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

/* ======================
   GET ALL
====================== */
export async function GET() {
  const db = await openDB();

  const rows = await db.all(`
    SELECT *
    FROM cases
    ORDER BY created_at DESC
  `);

  return NextResponse.json(rows);
}

/* ======================
   CREATE
====================== */
export async function POST(req: Request) {
  const db = await openDB();
  const body = await req.json();

  const {
    title,
    slug,
    industry,
    short_description,
    full_description,
    cover_image,
    hero_image,
    gallery
  } = body;

  await db.run(
    `
    INSERT INTO cases (
      title,
      slug,
      industry,
      short_description,
      full_description,
      cover_image,
      hero_image,
      gallery,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `,
    [
      title,
      slug,
      industry,
      short_description,
      full_description,
      cover_image,
      hero_image,
      JSON.stringify(gallery || [])
    ]
  );

  return NextResponse.json({ ok: true });
}