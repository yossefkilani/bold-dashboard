import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();

    const submission = await db.get(
      `SELECT * FROM submissions WHERE id = ?`,
      id
    );

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

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
      submission.full_name,
      submission.email,
      submission.business_sector,
      submission.project_name || "",
      "active"
    );

    await db.run(
      `UPDATE submissions SET status = ? WHERE id = ?`,
      "activated",
      id
    );

    return NextResponse.json({
      ok: true,
      projectId: result.lastID
    });

  } catch (error) {
    console.error("DASHBOARD ACTIVATE ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}