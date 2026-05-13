export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { openDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await openDB();
    const [rows]: any = await db.execute(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("PROJECTS GET ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await openDB();
    const body = await req.json();

    const email = body.contacts?.find((c: any) => c.type === "Email")?.value || "";
    const phone =
      body.contacts?.find((c: any) => c.type === "Phone" || c.type === "WhatsApp")?.value || "";

    const [result]: any = await db.execute(
      `INSERT INTO projects (full_name, email, phone, business_sector, project_name, total_price, status, start_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'active', ?, NOW())`,
      [
        body.client || "",
        email,
        phone,
        body.business || "",
        body.project || "",
        body.total ? Number(body.total) : null,
        body.startDate || null,
      ]
    );

    const projectId = result.insertId;

    if (Array.isArray(body.phases)) {
      for (let i = 0; i < body.phases.length; i++) {
        const p = body.phases[i];
        if (!p.title) continue;
        await db.execute(
          "INSERT INTO project_phases (project_id, title, duration_days, position, created_at) VALUES (?, ?, ?, ?, NOW())",
          [projectId, p.title, Number(p.days) || 1, i + 1]
        );
      }
    }

    if (Array.isArray(body.payments)) {
      let paid = 0;
      for (const pay of body.payments) {
        if (!pay.amount || !pay.date) continue;
        await db.execute(
          "INSERT INTO project_payments (project_id, title, amount, payment_date, created_at) VALUES (?, ?, ?, ?, NOW())",
          [projectId, pay.title || "Payment", Number(pay.amount), pay.date]
        );
        paid += Number(pay.amount);
      }
      if (paid > 0) {
        await db.execute("UPDATE projects SET paid_amount = ? WHERE id = ?", [paid, projectId]);
      }
    }

    if (Array.isArray(body.links) && body.links.length > 0) {
      await db.execute("UPDATE projects SET project_references = ? WHERE id = ?", [
        JSON.stringify(body.links),
        projectId,
      ]);
    }

    return NextResponse.json({ projectId });
  } catch (err) {
    console.error("PROJECTS POST ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
