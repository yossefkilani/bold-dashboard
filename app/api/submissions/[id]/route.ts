import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";
import { Client } from "basic-ftp";

export const runtime = "nodejs";

/* ===================== GET ===================== */

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const numericId = Number(id);

  if (!numericId || Number.isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const db = await openDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM submissions WHERE id = ? LIMIT 1",
    [numericId]
  );

  const data = rows?.[0];

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

/* ===================== DELETE ===================== */

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (!numericId || Number.isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const db = await openDB();

  const [rows]: any = await db.execute(
    "SELECT form_data FROM submissions WHERE id = ? LIMIT 1",
    [numericId]
  );

  const data = rows?.[0];

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let form: any = {};

  try {
    form = data.form_data ? JSON.parse(data.form_data) : {};
  } catch {}

  if (Array.isArray(form.files) && form.files.length > 0) {
    const client = new Client();

    try {
      await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        port: Number(process.env.FTP_PORT) || 21,
        secure: false,
      });

      for (const file of form.files) {
        if (typeof file !== "string") continue;

        // منع path traversal
        const safeFile = file.replace(/[^a-zA-Z0-9._-]/g, "");

        try {
          await client.remove(`/public_html/uploads/${safeFile}`);
        } catch {
          // لا نفشل لو الملف غير موجود
        }
      }
    } finally {
      client.close();
    }
  }

  await db.execute(
    "DELETE FROM submissions WHERE id = ?",
    [numericId]
  );

  return NextResponse.json({ success: true });
}