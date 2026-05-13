export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { uploadViaFTP } from "@/lib/ftp";

const FTP_DIR = "/public_html/uploads/cases";
const PUBLIC_BASE = "https://boldbrand.io/uploads/cases";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadViaFTP(buffer, `${FTP_DIR}/${safeName}`);

    return NextResponse.json({ url: `${PUBLIC_BASE}/${safeName}` });
  } catch (err) {
    console.error("CASE UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
