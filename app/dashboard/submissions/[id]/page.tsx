import { notFound } from "next/navigation";
import { openDB } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

  let form: any = {};

  try {
    form = data.form_data ? JSON.parse(data.form_data) : {};
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
            {form.business_sector || "—"}
          </p>
        </div>

        {/* INFO BLOCK */}
        <div className="space-y-6">
          <Info label="Service" value={form.other_service || form.service} />
          <Info label="Full Name" value={form.full_name} />
          <Info label="Email Address" value={form.email} />
          <Info label="Phone / WhatsApp" value={form.phone} />
          <Info label="Country / City" value={form.location} />
          <Info label="Brand / Project Name" value={form.project_name} />
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
              {form.links.map((link: string, i: number) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline break-all"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* FILES */}
        {Array.isArray(form.files) && form.files.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Attachments
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {form.files.map((f: string, i: number) => {
                            const fileUrl = `https://boldbrand.io/uploads/${f}`;
                            const fileName = f.split("/").pop();
                            const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(f);

                            return (
                              <div
                                key={i}
                                className="rounded-2xl shadow-md border bg-gray-50 p-4"
                              >
                                {isImage ? (
                                  <img
                                    src={fileUrl}
                                    alt=""
                                    className="w-full h-48 object-cover rounded mb-3"
                                  />
                                ) : (
                                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded mb-3 text-sm text-gray-400">
                                    File
                                  </div>
                                )}

                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline break-all"
                                >
                                  {fileName}
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

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