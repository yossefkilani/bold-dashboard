export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { openDB } from "@/lib/db";

/* ======================
   GET — LIST PROJECTS
====================== */
export async function GET() {
  try {
    const db = await openDB();

    const rows = await db.all(`
      SELECT
        p.id,
        p.project_name,
        p.full_name,
        p.status,
        p.created_at,
        p.total_price,
        p.paid_amount,
        p.start_date,
        COALESCE(SUM(ph.duration_days), 0) AS duration_days
      FROM projects p
      LEFT JOIN project_phases ph
        ON p.id = ph.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("PROJECTS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/* ======================
   POST — CREATE PROJECT
====================== */
export async function POST(req: Request) {
  try {
    const db = await openDB();
    const body = await req.json();

    const {
      client,
      project,
      contact,
      startDate,
      business,
      notes,
      phases,
      links,
      total,
      currency,
      payments
    } = body;

    if (!client || !project) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ---------- CREATE PROJECT ---------- */
    const result = await db.run(
      `
      INSERT INTO projects (
        full_name,
        email,
        phone,
        business_sector,
        project_name,
        project_description,
        start_date,
        total_price,
        paid_amount,
        project_references,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))
      `,
      client,
      contact,
      "", // phone (اختياري لاحقاً)
      business || "",
      project,
      notes || "",
      startDate || "",
      Number(total || 0),
      0,
      JSON.stringify(links || [])
    );

    const projectId = result.lastID;

    /* ---------- PHASES ---------- */
    if (Array.isArray(phases)) {
      let position = 1;
      for (const p of phases) {
        await db.run(
          `
          INSERT INTO project_phases (
            project_id,
            title,
            duration_days,
            position,
            created_at
          )
          VALUES (?, ?, ?, ?, datetime('now'))
          `,
          projectId,
          p.title || "",
          Number(p.days || 0),
          position++
        );
      }
    }

    /* ---------- PAYMENTS ---------- */
    let totalPaid = 0;

    if (Array.isArray(payments)) {
      for (const pay of payments) {
        const amount = Number(pay.amount || 0);
        totalPaid += amount;

        await db.run(
          `
          INSERT INTO project_payments (
            project_id,
            title,
            amount,
            payment_date,
            status,
            created_at
          )
          VALUES (?, ?, ?, ?, 'pending', datetime('now'))
          `,
          projectId,
          pay.title || "Payment",
          amount,
          pay.date || startDate
        );
      }
    }

    /* ---------- UPDATE PAID AMOUNT ---------- */
    await db.run(
      `
      UPDATE projects
      SET paid_amount = ?
      WHERE id = ?
      `,
      totalPaid,
      projectId
    );

    return NextResponse.json({
      success: true,
      projectId
    });
  } catch (err) {
    console.error("PROJECT POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}