export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await openDB();

    const submission = await db.get(
      `SELECT * FROM submissions WHERE id = ?`,
      params.id
    );

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // إنشاء مشروع من الطلب
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

    // تحديث حالة الطلب
    await db.run(
      `UPDATE submissions SET status = ? WHERE id = ?`,
      "activated",
      params.id
    );

    return NextResponse.json({
      success: true,
      project_id: result.lastID
    });
  } catch (err) {
    console.error("ACTIVATE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to activate submission" },
      { status: 500 }
    );
  }
}