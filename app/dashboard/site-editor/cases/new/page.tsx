"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCasePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    industry: "",
    paragraph: "",
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/cases", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        hero_image: "",
        cover_thumb: "",
        case_images: []
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    router.push(
      `/dashboard/site-editor/cases/${data.id}/edit`
    );
  }

  return (
    <div className="p-8 max-w-xl">

      <h1 className="text-2xl font-bold mb-6">
        Create Case
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          placeholder="Title"
          className="border p-3 w-full"
          value={form.title}
          onChange={e =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          placeholder="Slug (sweee-branding)"
          className="border p-3 w-full"
          value={form.slug}
          onChange={e =>
            setForm({ ...form, slug: e.target.value })
          }
        />

        <input
          placeholder="Industry"
          className="border p-3 w-full"
          value={form.industry}
          onChange={e =>
            setForm({ ...form, industry: e.target.value })
          }
        />

        <textarea
          placeholder="Paragraph"
          className="border p-3 w-full"
          rows={4}
          value={form.paragraph}
          onChange={e =>
            setForm({ ...form, paragraph: e.target.value })
          }
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}