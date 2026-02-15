import { NextResponse } from "next/server";
import { Client } from "basic-ftp";

export const runtime = "nodejs";

export async function GET() {
  try {
    const client = new Client();

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: Number(process.env.FTP_PORT) || 21,
      secure: false,
    });

    const list = await client.list();
    client.close();

    return NextResponse.json({ success: true, list });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}