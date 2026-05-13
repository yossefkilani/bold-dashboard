export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const heroPath = path.join(
  process.cwd(),
  "public/uploads/hero"
);

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  await fs.mkdir(heroPath, { recursive: true });

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
      heroPath,
      file.name
    );

    await fs.writeFile(filePath, buffer);
  }

  return NextResponse.json({ ok: true });
}