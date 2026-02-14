import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const numericId = Number(id);
  if (!numericId) return notFound();

  const db = await openDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM submissions WHERE id = ?",
    [numericId]
  );

  const data = rows?.[0];
  if (!data) return notFound();

  let form: any = {};
  try {
    form = data.form_data ? JSON.parse(data.form_data) : {};
  } catch {}

  return (
    <div>
      <h1>{form.project_name || "No name"}</h1>
    </div>
  );
}