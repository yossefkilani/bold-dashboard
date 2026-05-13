"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroSliderEditor() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch("/api/site-editor/hero");
    const data = await res.json();
    setImages(data.hero_slider || []);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));

      const res = await fetch("/api/site-editor/hero", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.uploaded?.length > 0) {
        setImages((prev) => [...prev, ...data.uploaded]);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removeImage(index: number) {
    const url = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    await fetch("/api/site-editor/hero", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  }

  function moveUp(i: number) {
    if (i === 0) return;
    const arr = [...images];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setImages(arr);
  }

  function moveDown(i: number) {
    if (i === images.length - 1) return;
    const arr = [...images];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    setImages(arr);
  }

  async function save() {
    setSaving(true);
    await fetch("/api/site-editor/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    });
    setSaving(false);
    alert("Saved! Hero slider updated.");
  }

  const imgSrc = (url: string) =>
    url.startsWith("http") ? url : `${window.location.origin}${url}`;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hero Slider</h1>
        <button
          onClick={save}
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded-xl text-sm hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Upload */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-black transition mb-6"
      >
        {uploading ? (
          <p className="text-gray-400">Uploading...</p>
        ) : (
          <>
            <p className="text-3xl mb-2">+</p>
            <p className="text-sm text-gray-500">Click to upload images</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Images list */}
      {images.length === 0 ? (
        <p className="text-gray-400 text-sm">No images yet. Upload some above.</p>
      ) : (
        <div className="space-y-3">
          {images.map((img, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white border rounded-xl p-3"
            >
              {/* Preview */}
              <img
                src={imgSrc(img)}
                alt=""
                className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
              />

              {/* URL */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 truncate">{img.split("/").pop()}</p>
                <p className="text-xs text-gray-300 truncate">{img}</p>
              </div>

              {/* Order controls */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === images.length - 1}
                  className="text-xs px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-30"
                >
                  ↓
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeImage(i)}
                className="text-red-500 hover:text-red-700 text-xl leading-none px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-400">
        {images.length} image{images.length !== 1 ? "s" : ""} — Use ↑ ↓ to reorder, then click <strong>Save Changes</strong>
      </div>
    </div>
  );
}
