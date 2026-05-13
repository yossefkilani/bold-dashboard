"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCasePage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [industry, setIndustry] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const coverRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/site-editor/cases/${id}`)
      .then((r) => r.json())
      .then((c) => {
        setTitle(c.title || "");
        setIndustry(c.industry || "");
        setShortDesc(c.short_description || "");
        setFullDesc(c.full_description || "");
        setCoverImage(c.cover_image || "");
        setHeroImage(c.hero_image || "");
        try { setGallery(JSON.parse(c.gallery || "[]")); } catch { setGallery([]); }
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/site-editor/cases/upload", { method: "POST", body: fd });
    const data = await res.json();
    return data.url || "";
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(await uploadFile(file));
  }

  async function handleHero(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroImage(await uploadFile(file));
  }

  async function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const urls = await Promise.all(Array.from(files).map(uploadFile));
    setGallery((prev) => [...prev, ...urls.filter(Boolean)]);
    if (galleryRef.current) galleryRef.current.value = "";
  }

  function removeGallery(i: number) {
    setGallery((prev) => prev.filter((_, x) => x !== i));
  }

  async function save() {
    if (!title) { alert("Title is required"); return; }
    setSaving(true);
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    await fetch(`/api/site-editor/cases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, industry, short_description: shortDesc, full_description: fullDesc, cover_image: coverImage, hero_image: heroImage, gallery }),
    });

    setSaving(false);
    alert("Saved!");
  }

  const imgSrc = (url: string) =>
    !url ? "" : url.startsWith("http") ? url : `${window.location.origin}${url}`;

  const inputCls = "w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-black";

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="max-w-2xl pb-32">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-sm text-gray-500">← Back</button>
        <h1 className="text-2xl font-bold">Edit Case</h1>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-2xl border p-5 space-y-4">
          <h2 className="font-semibold">Case Info</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Title *</label>
            <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Industry</label>
            <input className={inputCls} value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Short Description</label>
            <textarea className={`${inputCls} resize-none`} rows={2} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Full Description</label>
            <textarea className={`${inputCls} resize-none`} rows={4} value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-semibold mb-3">Cover Image <span className="text-xs text-gray-400">(thumbnail)</span></h2>
          {coverImage ? (
            <div className="relative">
              <img src={imgSrc(coverImage)} className="w-full h-48 object-cover rounded-xl" />
              <button onClick={() => setCoverImage("")} className="absolute top-2 right-2 bg-black text-white rounded-full w-7 h-7 text-sm">×</button>
            </div>
          ) : (
            <div onClick={() => coverRef.current?.click()} className="border-2 border-dashed rounded-xl h-36 flex items-center justify-center cursor-pointer hover:border-black transition">
              <span className="text-gray-400 text-sm">+ Upload cover image</span>
            </div>
          )}
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h2 className="font-semibold mb-3">Hero Image <span className="text-xs text-gray-400">(top of page)</span></h2>
          {heroImage ? (
            <div className="relative">
              <img src={imgSrc(heroImage)} className="w-full h-48 object-cover rounded-xl" />
              <button onClick={() => setHeroImage("")} className="absolute top-2 right-2 bg-black text-white rounded-full w-7 h-7 text-sm">×</button>
            </div>
          ) : (
            <div onClick={() => heroRef.current?.click()} className="border-2 border-dashed rounded-xl h-36 flex items-center justify-center cursor-pointer hover:border-black transition">
              <span className="text-gray-400 text-sm">+ Upload hero image</span>
            </div>
          )}
          <input ref={heroRef} type="file" accept="image/*" className="hidden" onChange={handleHero} />
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Gallery</h2>
            <button onClick={() => galleryRef.current?.click()} className="text-sm border px-3 py-1 rounded-lg hover:bg-gray-50">+ Add</button>
          </div>
          <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGallery} />
          {gallery.length === 0 ? (
            <p className="text-sm text-gray-400">No gallery images.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={imgSrc(img)} className="w-full h-28 object-cover rounded-lg" />
                  <button onClick={() => removeGallery(i)} className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button onClick={save} disabled={saving} className="w-full bg-black text-white rounded-full py-4 text-sm font-medium disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
