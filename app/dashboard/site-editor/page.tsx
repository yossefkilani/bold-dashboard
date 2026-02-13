"use client";

import { useEffect, useState } from "react";

export default function SiteEditorPage() {

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slider, setSlider] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/site-editor/hero");
      const data = await res.json();

      setSlider(
        Array.isArray(data.hero_slider)
          ? data.hero_slider
          : []
      );
    } catch {
      console.error("Failed to load hero images");
    } finally {
      setLoading(false);
    }
  }

  /* ======================
     SAVE ORDER
  ====================== */

  async function handleSave() {
    try {
      setSaving(true);

      await fetch("/api/site-editor/hero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hero_slider: slider
        })
      });

      alert("Saved successfully");

    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  /* ======================
     DELETE IMAGE
  ====================== */

  async function removeImage(index: number) {
    const fileName = slider[index]
      .split("/")
      .pop();

    await fetch("/api/site-editor/hero", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fileName })
    });

    await loadData();
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
          Hero Slider Editor
        </h1>

        <div className="space-y-4">
          {slider.map((img, index) => {

            const fileName = img.split("/").pop();

            return (
              <div
                key={img + index}
                className="flex items-center justify-between border rounded px-4 py-3 bg-white"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={img}
                    className="w-28 h-20 object-cover rounded"
                  />
                  <span className="text-sm font-medium">
                    {fileName}
                  </span>
                </div>

                <button
                  onClick={() => removeImage(index)}
                  className="text-red-600 font-medium"
                >
                  ✕
                </button>
              </div>
            );
          })}
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