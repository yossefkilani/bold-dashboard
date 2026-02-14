import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

export default async function SubmissionPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const db = openDB();

    const [rows]: any = await db.execute(
      "SELECT * FROM submissions WHERE id = ?",
      [params.id]
    );

    const data = rows?.[0];

    if (!data) return notFound();

    let form = {};
    try {
      form = data.form_data ? JSON.parse(data.form_data) : {};
    } catch {
      form = {};
    }

    return (
      <div>
        <h1>{form.project_name}</h1>
      </div>
    );
  } catch (err) {
    console.error("PAGE ERROR:", err);
    return <div>Server Error</div>;
  }
}