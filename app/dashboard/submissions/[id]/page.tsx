import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

eexport default async function SubmissionPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) return notFound();

  const db = await openDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM submissions WHERE id = ?",
    [id]
  );

  const data = rows?.[0];

  if (!data) return notFound();

  const form =
    data.form_data && typeof data.form_data === "string"
      ? JSON.parse(data.form_data)
      : {};

  return (
    <div>
      <h1>{form.project_name || "No name"}</h1>
    </div>
  );
}