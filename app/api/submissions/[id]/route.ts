export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";
import { Client } from "basic-ftp";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();
    const [[row]]: any = await db.execute(
      "SELECT * FROM submissions WHERE id = ? LIMIT 1",
      [id]
    );
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { status } = await req.json();
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

    const db = await openDB();
    await db.execute("UPDATE submissions SET status = ? WHERE id = ?", [status, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();

    const [[row]]: any = await db.execute(
      "SELECT form_data FROM submissions WHERE id = ? LIMIT 1",
      [id]
    );
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let form: any = {};
    try { form = JSON.parse(row.form_data || "{}"); } catch {}

    if (Array.isArray(form.files) && form.files.length > 0 && process.env.FTP_HOST) {
      const ftp = new Client();
      try {
        await ftp.access({
          host: process.env.FTP_HOST!,
          user: process.env.FTP_USER,
          password: process.env.FTP_PASSWORD,
          port: Number(process.env.FTP_PORT) || 21,
          secure: false,
        });
        for (const file of form.files) {
          if (typeof file !== "string") continue;
          const safe = file.replace(/[^a-zA-Z0-9._-]/g, "");
          try { await ftp.remove(`/public_html/uploads/${safe}`); } catch {}
        }
      } finally { ftp.close(); }
    }

    await db.execute("DELETE FROM submissions WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
