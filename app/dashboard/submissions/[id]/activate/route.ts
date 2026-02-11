export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const db = await openDB();

  const submission = await db.get(
    "SELECT * FROM submissions WHERE id = ?",
    id
  );

  if (!submission) {
    return NextResponse.json(
      { error: "Submission not found" },
      { status: 404 }
    );
  }

  const form = submission.form_data
    ? JSON.parse(submission.form_data)
    : {};

  const result = await db.run(
    `
    INSERT INTO projects (
      project_name,
      full_name,
      status,
      created_at
    )
    VALUES (?, ?, 'active', datetime('now'))
    `,
    [
      form.project_name || "Untitled Project",
      form.full_name || ""
    ]
  );

  await db.run(
    "DELETE FROM submissions WHERE id = ?",
    id
  );

  return NextResponse.json({
    ok: true,
    projectId: result.lastID
  });
}