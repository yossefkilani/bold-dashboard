"use client";

import { useEffect, useState } from "react";

export default function SiteEditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    hero_title: "",
    hero_subtitle: "",
    hero_image: "",
    about_text: "",
    contact_email: "",
    contact_phone: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/site");
      const data = await res.json();
      if (data) setForm(data);
    } catch (err) {
      console.error("Failed to load site data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        alert("Failed to save");
        return;
      }

      alert("Saved successfully");
    } catch {
      alert("Server error");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  if (loading) {
    return (
      <p className="p-6 text-gray-500">
        Loading editor...
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6">

      <div className="bg-white rounded-2xl shadow p-10 space-y-10">

        <h1 className="text-3xl font-bold">
          Site Editor
        </h1>

        {/* HERO SLIDER */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Hero Slider
          </h2>

          <input
            type="file"
            onChange={handleHeroUpload}
            className="text-sm"
          />

          <div className="grid grid-cols-3 gap-4 mt-4">
            {slides.map((slide) => (
              <div key={slide.id} className="relative">
                <img
                  src={`/uploads/${slide.image}`}
                  className="rounded-xl h-40 w-full object-cover"
                />

                <button
                  onClick={() => deleteSlide(slide.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            About Section
          </h2>

          <TextareaField
            label="About Text"
            name="about_text"
            value={form.about_text}
            onChange={handleChange}
          />
        </div>

        {/* CONTACT */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Contact Info
          </h2>

          <Field
            label="Contact Email"
            name="contact_email"
            value={form.contact_email}
            onChange={handleChange}
          />

          <Field
            label="Contact Phone"
            name="contact_phone"
            value={form.contact_phone}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white px-6 py-3 rounded-xl text-sm hover:bg-gray-800 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Field({
  label,
  name,
  value,
  onChange
}: any) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">
        {label}
      </p>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded-xl px-4 py-3 text-sm"
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange
}: any) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">
        {label}
      </p>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={4}
        className="w-full border rounded-xl px-4 py-3 text-sm"
      />
    </div>
  );
}