export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";
import fs from "fs/promises";
import path from "path";


const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.boldbrand.io",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
function json(data: any, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: corsHeaders,
  });
}

export async function OPTIONS() {
  return json({});
}
/* ======================
   POST — CREATE
====================== */
export async function POST(req: Request) {
  try {
    const db = await openDB();
    const formData = await req.formData();

    /* --------------------
       TEXT FIELDS
    -------------------- */
    const full_name = formData.get("full_name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const location = formData.get("location")?.toString() || "";
    const industry = formData.get("industry")?.toString() || "";
    const project_name = formData.get("project_name")?.toString() || "";
    const project_description =
      formData.get("project_description")?.toString() || "";
    const service =
      formData.get("service")?.toString() || "";
    const other_service =
      formData.get("other_service")?.toString() || "";


    const links = formData
      .getAll("links")
      .map(l => l.toString());

    /* --------------------
       FILE UPLOAD
    -------------------- */
    const uploadDir = path.join(
      process.cwd(),
      "public/uploads"
    );

    await fs.mkdir(uploadDir, {
      recursive: true
    });

    const files = formData.getAll("files") as File[];
    const savedFiles: string[] = [];

    for (const file of files) {
      if (!file || typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(
        uploadDir,
        fileName
      );

      await fs.writeFile(filePath, buffer);

      savedFiles.push(fileName);
    }

    /* --------------------
       JSON STORAGE
    -------------------- */
    const form_data = JSON.stringify({
      full_name,
      email,
      phone,
      location,
      industry,
      project_name,
      project_description,
      service,
      other_service,
      links,
      files: savedFiles
    });

 const result = await db.run(
   `
   INSERT INTO submissions (
     full_name,
     email,
     phone,
     business_sector,
     project_name,
     form_data,
     status,
     created_at
   )
   VALUES (?, ?, ?, ?, ?, ?, 'new', datetime('now'))
   `,
   [
     full_name,
     email,
     phone,
     industry,
     project_name,
     form_data
   ]
 );

 const submissionId = result.lastID;

 await db.run(
   `
   INSERT INTO notifications (
     type,
     message,
     project_id,
     is_read,
     created_at
   )
   VALUES (?, ?, ?, 0, datetime('now'))
   `,
   [
     "NEW_SUBMISSION",
     `New submission from ${full_name}`,
     submissionId
   ]
 );

    return json({ ok: true }, { headers: corsHeaders });

  } catch (err) {
    console.error(
      "SUBMISSIONS POST ERROR:",
      err
    );
    return json(
      { error: "Failed to create submission" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/* ======================
   GET — LIST
====================== */
export async function GET() {
  try {
    const db = await openDB();

    const rows = await db.all(`
      SELECT *
      FROM submissions
      ORDER BY created_at DESC
    `);

 return json(rows, { headers: corsHeaders });

  } catch (err) {
    console.error(
      "SUBMISSIONS GET ERROR:",
      err
    );
    return json(
      { error: "Failed to create submission" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/* ======================
   DELETE ALL
====================== */
export async function DELETE() {
  try {
    const db = await openDB();

    await db.run(`DELETE FROM submissions`);

    return json({ ok: true }, { headers: corsHeaders });

  } catch (err) {
    console.error("DELETE ALL ERROR:", err);
    return json(
      { error: "Failed to create submission" },
      { status: 500, headers: corsHeaders }
    );
  }
}