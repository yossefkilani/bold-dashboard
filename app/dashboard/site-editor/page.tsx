"use client";

import { useEffect, useState } from "react";

export default function IndexEditorPage() {

  const [slider, setSlider] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const res = await fetch("/api/site-editor/hero");
    const data = await res.json();
    setSlider(data || []);
  }

  /* ======================
     DRAG LOGIC
  ====================== */

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDrop(index: number) {
    if (dragIndex === null) return;

    const updated = [...slider];
    const draggedItem = updated[dragIndex];

    updated.splice(dragIndex, 1);
    updated.splice(index, 0, draggedItem);

    setSlider(updated);
    setDragIndex(null);
  }

  /* ======================
     SAVE ORDER
  ====================== */

  async function save() {
    await fetch("/api/site-editor/hero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hero_slider: slider
      }),
    });

    alert("Order saved");
  }

  /* ======================
     DELETE
  ====================== */

  async function removeImage(index: number) {
    const fileName = slider[index].split("/").pop();

    await fetch("/api/site-editor/hero", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName }),
    });

    await loadImages();
  }

  return (
    <div className="p-10 max-w-4xl">

      <h1 className="text-2xl font-bold mb-8">
        Hero Slider Editor
      </h1>

      <div className="space-y-4">
      {slider.map((img, index) => {
        const fileName = img.split("/").pop();

        return (
          <div
            key={img + index}
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", index.toString());
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const from = Number(e.dataTransfer.getData("text/plain"));
              const to = index;

              if (from === to) return;

              const updated = [...slider];
              const moved = updated[from];

              updated.splice(from, 1);
              updated.splice(to, 0, moved);

              setSlider(updated);
            }}
            className="flex items-center justify-between border rounded px-4 py-3 bg-white cursor-move select-none"
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
        onClick={save}
        className="mt-8 bg-black text-white px-6 py-3 rounded"
      >
        Save Order
      </button>

    </div>
  );
}