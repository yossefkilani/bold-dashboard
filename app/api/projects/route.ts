export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

/* ======================
   GET PROJECT + PHASES + PAYMENTS
====================== */
export async function GET(request: NextRequest) {
  try {
    const { id } = await context.params;
    const db = await openDB();

    const project = await db.get(
      `SELECT * FROM projects WHERE id = ?`,
      id
    );

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const phases = await db.all(
      `
      SELECT *
      FROM project_phases
      WHERE project_id = ?
      ORDER BY position ASC
      `,
      id
    );

    const payments = await db.all(
      `
      SELECT *
      FROM project_payments
      WHERE project_id = ?
      ORDER BY payment_date ASC
      `,
      id
    );

    return NextResponse.json({
      project,
      phases,
      payments
    });

  } catch (err) {
    console.error("PROJECT GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load project" },
      { status: 500 }
    );
  }
}

/* ======================
   POST — ADD PHASE OR PAYMENT
====================== */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();
    const body = await req.json();

    /* ---------- ADD PHASE ---------- */
    if (body.type === "phase") {
      const { title, duration_days } = body;

      if (!title || !duration_days) {
        return NextResponse.json(
          { error: "Missing phase data" },
          { status: 400 }
        );
      }

      const last = await db.get(
        `
        SELECT MAX(position) as pos
        FROM project_phases
        WHERE project_id = ?
        `,
        id
      );

      const position = (last?.pos || 0) + 1;

      const result = await db.run(
        `
        INSERT INTO project_phases (
          project_id,
          title,
          duration_days,
          position,
          created_at
        ) VALUES (?, ?, ?, ?, datetime('now'))
        `,
        id,
        title,
        duration_days,
        position
      );

      return NextResponse.json({ id: result.lastID });
    }

    /* ---------- ADD PAYMENT ---------- */
    if (body.type === "payment") {
      const { title, amount, payment_date } = body;

      const result = await db.run(
        `
        INSERT INTO project_payments (
          project_id, title, amount, payment_date, created_at
        )
        VALUES (?, ?, ?, ?, datetime('now'))
        `,
        id,
        title,
        amount,
        payment_date
      );

      const totalPaid = await db.get(
        `
        SELECT SUM(amount) as sum
        FROM project_payments
        WHERE project_id = ?
        `,
        id
      );

      await db.run(
        `
        UPDATE projects
        SET paid_amount = ?
        WHERE id = ?
        `,
        totalPaid?.sum || 0,
        id
      );

      return NextResponse.json({ id: result.lastID });
    }

    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 }
    );

  } catch (err) {
    console.error("PROJECT POST ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* ======================
   PUT — UPDATE DATA
====================== */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();
    const body = await req.json();

    if (body.type === "phase-date") {
      const { phaseId, start_date } = body;

      await db.run(
        `
        UPDATE project_phases
        SET start_date = ?
        WHERE id = ? AND project_id = ?
        `,
        start_date,
        phaseId,
        id
      );

      return NextResponse.json({ success: true });
    }

    if (body.type === "references") {
      await db.run(
        `
        UPDATE projects
        SET project_references = ?
        WHERE id = ?
        `,
        JSON.stringify(body.project_references),
        id
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid update type" },
      { status: 400 }
    );

  } catch (err) {
    console.error("PROJECT PUT ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* ======================
   DELETE PROJECT
====================== */
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await openDB();

    await db.run(`DELETE FROM projects WHERE id = ?`, id);
    await db.run(`DELETE FROM project_phases WHERE project_id = ?`, id);
    await db.run(`DELETE FROM project_payments WHERE project_id = ?`, id);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("PROJECT DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}