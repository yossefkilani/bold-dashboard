export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "hero");
const PUBLIC_BASE = "/uploads/hero";

/* ===================== GET ===================== */
export async function GET() {
  try {
    const db = await openDB();
    const [[row]]: any = await db.execute(
      "SELECT value FROM site_settings WHERE key_name = 'hero_slider' LIMIT 1"
    );
    const images: string[] = row ? JSON.parse(row.value || "[]") : [];
    return NextResponse.json({ hero_slider: images });
  } catch {
    return NextResponse.json({ hero_slider: [] });
  }
}

/* ===================== POST — upload images ===================== */
export async function POST(req: Request) {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const uploaded: string[] = [];

    for (const file of files) {
      if (!file || typeof file === "string") continue;
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(UPLOAD_DIR, safeName), buffer);
      uploaded.push(`${PUBLIC_BASE}/${safeName}`);
    }

    return NextResponse.json({ uploaded });
  } catch (err) {
    console.error("HERO UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/* ===================== PUT — save slider order ===================== */
export async function PUT(req: Request) {
  try {
    const { images } = await req.json();
    const db = await openDB();
    const value = JSON.stringify(images || []);

    await db.execute(
      `INSERT INTO site_settings (key_name, value) VALUES ('hero_slider', ?)
       ON DUPLICATE KEY UPDATE value = ?, updated_at = NOW()`,
      [value, value]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}

/* ===================== DELETE — remove one image ===================== */
export async function DELETE(req: Request) {
  try {
    const { url } = await req.json();
    const filename = url.split("/").pop();

    if (filename) {
      try {
        await fs.unlink(path.join(UPLOAD_DIR, filename));
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
