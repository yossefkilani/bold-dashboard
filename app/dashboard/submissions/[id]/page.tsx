import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

export default async function SubmissionPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const db = openDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM submissions WHERE id = ?",
    [id]
  );

  const data = rows[0];

  if (!data) return notFound();

  const form = data.form_data
    ? JSON.parse(data.form_data)
    : {};

  return (
    <div>
      {/* نفس UI تبعك */}
    </div>
  );
}