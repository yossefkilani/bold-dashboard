import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(
  process.cwd(),
  "public/data/hero.json"
);

const uploadDir = path.join(
  process.cwd(),
  "public/hero"
);

/* ======================
   GET
====================== */
export async function GET() {
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    return NextResponse.json(JSON.parse(file));
  } catch {
    return NextResponse.json({ hero_slider: [] });
  }
}

/* ======================
   POST (Save Images List)
====================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    await fs.writeFile(
      dataPath,
      JSON.stringify(body, null, 2)
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}

/* ======================
   UPLOAD
====================== */
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    await fs.mkdir(uploadDir, { recursive: true });

    const files = formData.getAll("files") as File[];
    const saved: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-" + file.name;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      saved.push("/bold-site/uploads/hero/" + fileName);
    }

    return NextResponse.json(saved);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}