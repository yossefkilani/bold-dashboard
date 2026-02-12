export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

/* ======================
   GET ALL PROJECTS
====================== */
export async function GET(request: NextRequest) {
  try {
    const db = await openDB();

    const projects = await db.all(
      `SELECT * FROM projects ORDER BY created_at DESC`
    );

    return NextResponse.json(projects);

  } catch (error) {
    console.error("PROJECT LIST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

/* ======================
   CREATE PROJECT
====================== */
export async function POST(request: NextRequest) {
  try {
    const db = await openDB();
    const body = await request.json();

    const result = await db.run(
      `
      INSERT INTO projects (
        full_name,
        email,
        business_sector,
        project_name,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, datetime('now'))
      `,
      body.full_name,
      body.email,
      body.business_sector,
      body.project_name || "",
      "active"
    );

    return NextResponse.json({ id: result.lastID });

  } catch (error) {
    console.error("PROJECT CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}