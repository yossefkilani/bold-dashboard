import { NextResponse } from "next/server";
import { Client } from "basic-ftp";
import { Readable } from "stream";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    const client = new Client();

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT) || 21,
      secure: false,
    });

    await client.ensureDir("/public_html/uploads");

    const stream = Readable.from(buffer);

    await client.uploadFrom(
      stream,
      `/public_html/uploads/${fileName}`
    );

    client.close();

    return NextResponse.json({
      success: true,
      file: fileName,
      url: `https://boldbrand.io/uploads/${fileName}`,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}