export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";
import { Client } from "basic-ftp";

const CORS = {
  "Access-Control-Allow-Origin": "https://www.boldbrand.io",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const db = await openDB();
    const [rows]: any = await db.execute(
      "SELECT * FROM submissions ORDER BY created_at DESC"
    );
    return NextResponse.json(rows, { headers: CORS });
  } catch (err) {
    console.error("SUBMISSIONS GET ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await openDB();
    const formData = await req.formData();

    const full_name = formData.get("full_name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const location = formData.get("location")?.toString() || "";
    const industry = formData.get("industry")?.toString() || "";
    const project_name = formData.get("project_name")?.toString() || "";
    const project_description = formData.get("project_description")?.toString() || "";
    const service = formData.get("service")?.toString() || "";
    const other_service = formData.get("other_service")?.toString() || "";
    const links = formData.getAll("links").map((l) => l.toString());

    // Upload files via FTP
    const files = formData.getAll("files") as File[];
    const savedFiles: string[] = [];

    if (files.length > 0 && process.env.FTP_HOST) {
      const ftp = new Client();
      try {
        await ftp.access({
          host: process.env.FTP_HOST,
          user: process.env.FTP_USER,
          password: process.env.FTP_PASSWORD,
          port: Number(process.env.FTP_PORT) || 21,
          secure: false,
        });

        for (const file of files) {
          if (!file || typeof file === "string") continue;
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
          const { Readable } = await import("stream");
          const stream = Readable.from(buffer);
          await ftp.uploadFrom(stream, `/public_html/uploads/${fileName}`);
          savedFiles.push(fileName);
        }
      } finally {
        ftp.close();
      }
    }

    const form_data = JSON.stringify({
      full_name, email, phone, location, industry,
      project_name, project_description, service, other_service,
      links, files: savedFiles,
    });

    const [result]: any = await db.execute(
      `INSERT INTO submissions (full_name, email, phone, business_sector, project_name, form_data, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'new', NOW())`,
      [full_name, email, phone, industry, project_name, form_data]
    );

    await db.execute(
      `INSERT INTO notifications (type, message, project_id, is_read, created_at)
       VALUES ('NEW_SUBMISSION', ?, ?, 0, NOW())`,
      [`New submission from ${full_name}`, result.insertId]
    );

    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch (err) {
    console.error("SUBMISSIONS POST ERROR:", err);
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
