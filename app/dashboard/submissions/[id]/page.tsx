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

  if (!data) {
    return notFound();
  }

  let form: SubmissionForm = {};

  try {
    form = data.form_data
      ? JSON.parse(data.form_data)
      : {};
  } catch {
    form = {};
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6">
      <div className="bg-white rounded-2xl shadow p-10 space-y-8">

        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold">
            Submission #{data.id}
          </h1>
          <p className="text-gray-500 mt-2">
            {form.project_name || data.full_name || "Untitled"}
          </p>
        </div>

        <Info label="Full Name" value={form.full_name} />
        <Info label="Email" value={form.email} />
        <Info label="Phone" value={form.phone} />
        <Info label="Location" value={form.location} />
        <Info label="Industry" value={form.industry} />
        <Info label="Service" value={form.other_service || form.service} />

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