import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

export default async function SubmissionPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const id = Number(params?.id);

    if (!id) {
      return <div>Invalid ID</div>;
    }

    const db = await openDB();

    const [rows]: any = await db.execute(
      "SELECT id, form_data FROM submissions WHERE id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return notFound();
    }

    const data = rows[0];

    return (
      <div style={{ padding: 40 }}>
        <h1>Submission #{data.id}</h1>
        <pre>{data.form_data}</pre>
      </div>
    );
  } catch (err: any) {
    console.error("PAGE ERROR:", err);
    return <div>Server Error</div>;
  }
}