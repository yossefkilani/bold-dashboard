import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

/* ======================
   GET HERO IMAGES
====================== */
export async function GET() {
  try {
    const heroPath = path.join(
      process.cwd(),
      "public",
      "hero"
    );

    const files = fs.readdirSync(heroPath);

    const images = files.map(
      (file) => "/hero/" + file
    );

    return NextResponse.json({
      hero_slider: images
    });

  } catch (err) {
    return NextResponse.json(
      { hero_slider: [] }
    );
  }
}