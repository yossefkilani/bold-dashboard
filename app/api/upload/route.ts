import { NextResponse } from "next/server";
import { Client } from "basic-ftp";
import { Readable } from "stream";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large" },
        { status: 400, headers: corsHeaders }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400, headers: corsHeaders }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name || "file";
    const extension = originalName.includes(".")
      ? originalName.split(".").pop()
      : "jpg";

    const safeBase = originalName.replace(/\.[^/.]+$/, "").replace(/\s/g, "_");

    const fileName = `${Date.now()}-${safeBase}.${extension}`;

    const client = new Client();

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT) || 21,
      secure: false,
    });

    await client.ensureDir("uploads");


    const stream = Readable.from(buffer);

    await client.uploadFrom(
      stream,
      `uploads/${fileName}`
    );

    client.close();

    return NextResponse.json(
      {
        success: true,
        file: fileName,
        url: `https://boldbrand.io/uploads/${fileName}`,
      },
      { headers: corsHeaders }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}