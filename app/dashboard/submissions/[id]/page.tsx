import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (!id) {
    return <div>Invalid ID</div>;
  }

  const db = await openDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM submissions WHERE id = ?",
    [id]
  );

  const submission = rows?.[0];

  if (!submission) {
    return notFound();
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Submission #{submission.id}</h1>
      <pre>{JSON.stringify(submission, null, 2)}</pre>
    </div>
  );
}