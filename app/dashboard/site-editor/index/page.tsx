"use client";

import { useEffect, useState } from "react";

export default function IndexEditorPage() {

  const [slider, setSlider] = useState<string[]>([]);

  /* ======================
     LOAD
  ====================== */
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await fetch("/api/site-editor/hero");
    const data = await res.json();

    setSlider(data.hero_slider || []);
  }

  /* ======================
     UPLOAD
  ====================== */
  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();

    Array.from(files).forEach(file => {
      formData.append("files", file);
    });

    const res = await fetch("/api/site-editor/hero", {
      method: "PUT",
      body: formData,
    });

    const newImages = await res.json();

    setSlider(prev => [...prev, ...newImages]);

    e.target.value = "";
  }

  /* ======================
     DELETE (from state only)
  ====================== */
  function removeImage(index: number) {
    setSlider(prev => prev.filter((_, i) => i !== index));
  }

  /* ======================
     SAVE (المهم)
  ====================== */
  async function save() {
    await fetch("/api/site-editor/hero", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hero_slider: slider,
      }),
    });

    alert("Saved successfully");
  }

  return (
    <div className="p-10 max-w-4xl">

      <h1 className="text-2xl font-bold mb-8">
        Hero Slider Editor
      </h1>

      {/* Upload */}
      <input
        type="file"
        multiple
        onChange={handleUpload}
        className="border p-3 rounded mb-8"
      />

      {/* Images List */}
      <div className="space-y-4 mb-10">
        {slider.map((img, i) => {

          const fileName = img.split("/").pop();

          return (
            <div
              key={i}
              className="flex items-center justify-between border rounded px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={img}
                  className="w-28 h-20 object-cover rounded"
                />

                <span className="text-sm">
                  {fileName}
                </span>
              </div>

              <button
                onClick={() => removeImage(i)}
                className="text-red-600 font-medium"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={save}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Save Changes
      </button>

    </div>
  );
}