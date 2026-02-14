import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

export default async function SubmissionPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);

  if (!id || isNaN(id)) {
    return notFound();
  }

  const db = await openDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM submissions WHERE id = ?",
    [id]
  );

  const data = rows?.[0];

  if (!data) return notFound();

  let form: any = {};

  try {
    form = data.form_data ? JSON.parse(data.form_data) : {};
  } catch {
    form = {};
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6">
      <div className="bg-white rounded-2xl shadow p-10 space-y-12">

        <div className="border-b pb-6 space-y-2">
          <h1 className="text-3xl font-bold break-words">
            {form.project_name || "Untitled Project"}
          </h1>
          <p className="text-gray-500">
            {data.business_sector || "—"}
          </p>
        </div>

        <div className="space-y-6">
          <Info label="Service" value={form.other_service || form.service} />
          <Info label="Full Name" value={form.full_name} />
          <Info label="Email Address" value={form.email} />
          <Info label="Phone / WhatsApp" value={form.phone} />
          <Info label="Country / City" value={form.location} />
          <Info label="Brand / Project Name" value={form.project_name} />
          <Info label="Industry" value={form.industry} />
        </div>

        <div className="pt-6 border-t text-xs text-gray-400">
          Created at: {new Date(data.created_at).toLocaleString()}
        </div>

      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value || "—"}</p>
    </div>
  );
}