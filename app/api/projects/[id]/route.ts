export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

async function pid(ctx: { params: Promise<{ id: string }> }) {
  return (await ctx.params).id;
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const id = await pid(ctx);
    const db = await openDB();

    const [[project]]: any = await db.execute(
      "SELECT * FROM projects WHERE id = ? LIMIT 1",
      [id]
    );
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [phases]: any = await db.execute(
      "SELECT * FROM project_phases WHERE project_id = ? ORDER BY position ASC",
      [id]
    );
    const [payments]: any = await db.execute(
      "SELECT * FROM project_payments WHERE project_id = ? ORDER BY payment_date ASC",
      [id]
    );

    return NextResponse.json({ project, phases, payments });
  } catch (err) {
    console.error("PROJECT GET ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const id = await pid(ctx);
    const db = await openDB();
    const body = await req.json();

    if (body.type === "phase") {
      const { title, duration_days } = body;
      if (!title || !duration_days) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
      }
      const [[last]]: any = await db.execute(
        "SELECT MAX(position) as pos FROM project_phases WHERE project_id = ?",
        [id]
      );
      const pos = (last?.pos || 0) + 1;
      const [r]: any = await db.execute(
        "INSERT INTO project_phases (project_id, title, duration_days, position, created_at) VALUES (?, ?, ?, ?, NOW())",
        [id, title, duration_days, pos]
      );
      return NextResponse.json({ id: r.insertId });
    }

    if (body.type === "payment") {
      const { title, amount, payment_date } = body;
      const [r]: any = await db.execute(
        "INSERT INTO project_payments (project_id, title, amount, payment_date, created_at) VALUES (?, ?, ?, ?, NOW())",
        [id, title, amount, payment_date]
      );
      const [[sum]]: any = await db.execute(
        "SELECT SUM(amount) as s FROM project_payments WHERE project_id = ?",
        [id]
      );
      await db.execute("UPDATE projects SET paid_amount = ? WHERE id = ?", [sum?.s || 0, id]);
      return NextResponse.json({ id: r.insertId });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("PROJECT POST ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const id = await pid(ctx);
    const db = await openDB();
    const body = await req.json();

    if (body.type === "phase-date") {
      await db.execute(
        "UPDATE project_phases SET start_date = ? WHERE id = ? AND project_id = ?",
        [body.start_date, body.phaseId, id]
      );
      return NextResponse.json({ success: true });
    }

    if (body.type === "references") {
      await db.execute(
        "UPDATE projects SET project_references = ? WHERE id = ?",
        [JSON.stringify(body.project_references), id]
      );
      return NextResponse.json({ success: true });
    }

    if (body.type === "status") {
      await db.execute("UPDATE projects SET status = ? WHERE id = ?", [body.status, id]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("PROJECT PUT ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const id = await pid(ctx);
    const db = await openDB();
    await db.execute("DELETE FROM project_phases WHERE project_id = ?", [id]);
    await db.execute("DELETE FROM project_payments WHERE project_id = ?", [id]);
    await db.execute("DELETE FROM projects WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PROJECT DELETE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
