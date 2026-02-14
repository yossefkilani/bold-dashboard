import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const runtime = "nodejs";

type FormDataType = {
  project_name?: string;
  project_description?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  industry?: string;
  service?: string;
  other_service?: string;
  links?: string[];
};

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

  let form: FormDataType = {};

  try {
    form = data.form_data
      ? JSON.parse(data.form_data)
      : {};
  } catch {
    form = {};
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6">
      <div className="bg-white rounded-2xl shadow p-10 space-y-12">

        {/* HEADER */}
        <div className="border-b pb-6 space-y-2">
          <h1 className="text-3xl font-bold break-words">
            {form.project_name || "Untitled Project"}
          </h1>
          <p className="text-gray-500">
            {data.business_sector || "—"}
          </p>
        </div>

        {/* INFO */}
        <div className="space-y-6">
          <Info label="Service" value={form.other_service || form.service} />
          <Info label="Full Name" value={form.full_name} />
          <Info label="Email Address" value={form.email} />
          <Info label="Phone / WhatsApp" value={form.phone} />
          <Info label="Country / City" value={form.location} />
          <Info label="Industry" value={form.industry} />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            About Your Project
          </p>
          <div className="bg-gray-50 p-6 rounded-2xl whitespace-pre-line break-words leading-relaxed">
            {form.project_description || "—"}
          </div>
        </div>

        {/* LINKS */}
        {Array.isArray(form.links) && form.links.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Reference Links
            </p>
            <div className="space-y-2">
              {form.links.map((link, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  className="block text-blue-600 hover:underline break-all"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="pt-6 border-t text-xs text-gray-400">
          Created at:{" "}
          {data.created_at
            ? new Date(data.created_at).toLocaleString()
            : "—"}
        </div>

      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value || "—"}</p>
    </div>
  );
}