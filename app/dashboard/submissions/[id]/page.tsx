import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SubmissionPage({ params }: PageProps) {
  const { id } = await params;

  const numericId = Number(id);

  if (!numericId || Number.isNaN(numericId)) {
    notFound();
  }

  const db = await openDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM submissions WHERE id = ? LIMIT 1",
    [numericId]
  );

  const data = rows?.[0];

  if (!data) {
    notFound();
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Submission #{data.id}
      </h1>
    </div>
  );
}