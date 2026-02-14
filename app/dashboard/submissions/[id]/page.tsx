import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

export default async function SubmissionPage({
  params,
}: {
  params: { id: string };
}) {
  const db = openDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM submissions WHERE id = ?",
    [params.id]
  );

  const data = rows[0];

  if (!data) return notFound();

  const form = data.form_data
    ? JSON.parse(data.form_data)
    : {};

  return (
    <div>
      <h1>{form.project_name}</h1>
    </div>
  );
}