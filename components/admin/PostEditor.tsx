"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft, Loader2, CheckCircle2, AlertCircle, X,
  Globe, FileText, Tag, Image as ImageIcon, Upload,
  Trash2, Search, ToggleLeft, ToggleRight, Info,
} from "lucide-react";

// ─── Dynamic Tiptap editor (no SSR) ──────────────────────────────────────────
const TiptapEditor = dynamic(() => import("./TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-white/8 bg-[#141414] flex items-center justify-center min-h-105">
      <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
    </div>
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
interface SeoData {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

interface PostFormData {
  title: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  tags: string[];
  category: string;
  coverImage: string;
  coverImagePublicId: string;
  featured: boolean;
  allowComments: boolean;
  seo: SeoData;
}

type ToastState = { type: "success" | "error"; message: string } | null;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={`flex items-center gap-3 px-4 py-3 text-sm border ${
        type === "success"
          ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
          : "bg-red-950/40 border-red-500/20 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Field label ──────────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className={`${bodyFont.className} text-[10px] tracking-[0.2em] uppercase text-white/30 font-semibold flex items-center gap-1`}
    >
      {children}
      {required && <span className="text-[#c8a96e]">*</span>}
    </label>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({
  value,
  onChange,
  label,
  hint,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full group cursor-pointer py-2"
    >
      <div className="flex flex-col gap-0.5 text-left">
        <span className={`${bodyFont.className} text-xs text-white/60 group-hover:text-white/80 transition-colors`}>
          {label}
        </span>
        {hint && (
          <span className={`${bodyFont.className} text-[10px] text-white/25`}>{hint}</span>
        )}
      </div>
      {value ? (
        <ToggleRight className="w-5 h-5 text-[#c8a96e] shrink-0" />
      ) : (
        <ToggleLeft className="w-5 h-5 text-white/20 shrink-0" />
      )}
    </button>
  );
}

// ─── PostEditor ───────────────────────────────────────────────────────────────
export default function PostEditor({
  postId,
  initialData,
  fetchingInitial,
}: {
  postId?: string;
  initialData?: Partial<PostFormData>;
  fetchingInitial?: boolean;
}) {
  const router = useRouter();
  const isEdit = Boolean(postId);
  const coverFileRef = useRef<HTMLInputElement>(null);

  const defaultForm: PostFormData = {
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
    tags: [],
    category: "",
    coverImage: "",
    coverImagePublicId: "",
    featured: false,
    allowComments: true,
    seo: { metaTitle: "", metaDescription: "", ogImage: "" },
  };

  const [form, setForm] = useState<PostFormData>({
    ...defaultForm,
    ...initialData,
    seo: { ...defaultForm.seo, ...initialData?.seo },
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  // Sync when edit initial data arrives
  useEffect(() => {
    if (initialData) {
      setForm({ ...defaultForm, ...initialData, seo: { ...defaultForm.seo, ...initialData?.seo } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const set = useCallback(<K extends keyof PostFormData>(field: K, value: PostFormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value })), []);

  const setSeo = useCallback(<K extends keyof SeoData>(field: K, value: string) =>
    setForm((prev) => ({ ...prev, seo: { ...prev.seo, [field]: value } })), []);

  // Tags
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag]);
    setTagInput("");
  };
  const removeTag = (tag: string) => set("tags", form.tags.filter((t) => t !== tag));

  // Cover image upload
  const handleCoverUpload = useCallback(async (file: File) => {
    setCoverUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "miller-and-co/blog/covers");
      const res = await fetch("/api/admin/cdn/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setForm((prev) => ({ ...prev, coverImage: data.url, coverImagePublicId: data.publicId }));
    } catch (err) {
      setToast({ type: "error", message: (err as Error).message });
    } finally {
      setCoverUploading(false);
    }
  }, []);

  // Save / Publish
  const handleSave = async (overrideStatus?: "draft" | "published") => {
    if (!form.title.trim()) { setToast({ type: "error", message: "Title is required." }); return; }
    if (!form.content || form.content === "<p></p>") { setToast({ type: "error", message: "Content cannot be empty." }); return; }

    setSaving(true);
    const payload = { ...form, status: overrideStatus ?? form.status };

    try {
      let res: Response;
      if (isEdit) {
        res = await fetch(`/api/admin/blogs/${postId}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/blogs", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save.");

      const newStatus = payload.status;
      setToast({
        type: "success",
        message: isEdit
          ? `Post ${newStatus === "published" ? "published" : "saved as draft"}.`
          : `Post ${newStatus === "published" ? "published" : "created as draft"}.`,
      });
      setForm((prev) => ({ ...prev, status: newStatus }));
      if (!isEdit) setTimeout(() => router.push("/admin/blogs"), 900);
    } catch (err) {
      setToast({ type: "error", message: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `${bodyFont.className} w-full bg-[#1a1a1a] border border-white/8 text-white/80 text-sm px-3 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40 transition-colors`;
  const textareaCls = `${inputCls} resize-none`;

  return (
    <div className={`${bodyFont.className} flex flex-col h-full`}>
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50 w-84 max-w-[calc(100vw-2rem)]">
        <AnimatePresence mode="wait">
          {toast && <Toast key="t" type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/6 shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => router.push("/admin/blogs")}
            className="text-white/30 hover:text-white/70 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className={`${headlineFont.className} text-base sm:text-lg font-semibold text-[#faf8f5] truncate`}>
            {isEdit ? "Edit Post" : "New Post"}
          </h1>
          <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${
            form.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/6 text-white/30"
          }`}>
            {form.status}
          </span>
          {form.featured && (
            <span className="hidden sm:inline shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#c8a96e]/10 text-[#c8a96e]">
              Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className={`${bodyFont.className} flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all cursor-pointer disabled:opacity-40`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className={`${bodyFont.className} flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#d4b87a] transition-colors cursor-pointer disabled:opacity-40`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
            {form.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      {fetchingInitial ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] h-full">

            {/* ── Main ─────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-5 p-4 md:p-6 border-r border-white/6">

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <Label required>Post Title</Label>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Enter a compelling headline…"
                  className={`${bodyFont.className} w-full bg-[#1a1a1a] border border-white/8 text-white/90 text-lg sm:text-xl px-4 py-3 placeholder:text-white/15 focus:outline-none focus:border-[#c8a96e]/40 transition-colors`}
                />
              </div>

              {/* Rich text editor */}
              <div className="flex flex-col gap-1.5">
                <Label required>Content</Label>
                <TiptapEditor
                  content={form.content}
                  onChange={(html) => set("content", html)}
                  placeholder="Start writing your post…"
                />
              </div>

              {/* Excerpt */}
              <div className="flex flex-col gap-1.5">
                <Label>Excerpt</Label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  placeholder="Short summary shown in post listings and search results…"
                  className={textareaCls}
                />
                <p className={`${bodyFont.className} text-[10px] text-white/20`}>
                  {form.excerpt.length}/160 characters
                </p>
              </div>
            </div>

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <div className="flex flex-col xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto border-t xl:border-t-0 border-white/6">

              {/* Cover Image */}
              <div className="flex flex-col gap-3 p-4 md:p-5 border-b border-white/6">
                <Label>Cover Image</Label>
                {form.coverImage ? (
                  <div className="flex flex-col gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.coverImage} alt="Cover" className="w-full aspect-video object-cover" />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => coverFileRef.current?.click()}
                        disabled={coverUploading}
                        className={`${bodyFont.className} flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] uppercase tracking-wider font-semibold border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all cursor-pointer disabled:opacity-40`}
                      >
                        {coverUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, coverImage: "", coverImagePublicId: "" }))}
                        className={`${bodyFont.className} flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] uppercase tracking-wider font-semibold border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all cursor-pointer`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverFileRef.current?.click()}
                    disabled={coverUploading}
                    className="flex flex-col items-center justify-center gap-2 border border-dashed border-white/10 aspect-video text-white/25 hover:text-white/50 hover:border-white/20 transition-all cursor-pointer disabled:opacity-40"
                  >
                    {coverUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5" />
                        <span className={`${bodyFont.className} text-[10px] tracking-wider uppercase`}>Upload cover image</span>
                        <span className={`${bodyFont.className} text-[9px] text-white/15`}>JPEG · PNG · WebP · AVIF · max 10 MB</span>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); e.target.value = ""; }}
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2 p-4 md:p-5 border-b border-white/6">
                <Label>Category</Label>
                <input
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="e.g. Corporate Law"
                  className={inputCls}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-2 p-4 md:p-5 border-b border-white/6">
                <Label>Tags</Label>
                <div className="flex gap-1.5">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                    placeholder="Type tag and press Enter…"
                    className={`${inputCls} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 bg-white/6 border border-white/8 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {form.tags.map((t) => (
                      <span key={t} className={`${bodyFont.className} flex items-center gap-1 px-2 py-0.5 bg-[#c8a96e]/8 border border-[#c8a96e]/20 text-[#c8a96e] text-[10px]`}>
                        {t}
                        <button type="button" onClick={() => removeTag(t)} className="text-[#c8a96e]/50 hover:text-[#c8a96e] cursor-pointer">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-0 p-4 md:p-5 border-b border-white/6">
                <Label>Settings</Label>
                <div className="mt-2 divide-y divide-white/5">
                  <Toggle value={form.featured} onChange={(v) => set("featured", v)} label="Featured Post" hint="Shown prominently on the blog homepage" />
                  <Toggle value={form.allowComments} onChange={(v) => set("allowComments", v)} label="Allow Comments" hint="Enable reader comments on this post" />
                </div>
              </div>

              {/* SEO */}
              <div className="flex flex-col gap-3 p-4 md:p-5">
                <div className="flex items-center gap-2">
                  <Label>SEO Settings</Label>
                  <Search className="w-3 h-3 text-white/20" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <span className={`${bodyFont.className} text-[10px] text-white/25`}>Meta title</span>
                    <input
                      value={form.seo.metaTitle}
                      onChange={(e) => setSeo("metaTitle", e.target.value)}
                      placeholder={form.title || "Auto from post title"}
                      className={inputCls}
                    />
                    <span className={`${bodyFont.className} text-[9px] text-white/20`}>{form.seo.metaTitle.length}/60 · blank = post title</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`${bodyFont.className} text-[10px] text-white/25`}>Meta description</span>
                    <textarea
                      rows={2}
                      value={form.seo.metaDescription}
                      onChange={(e) => setSeo("metaDescription", e.target.value)}
                      placeholder={form.excerpt || "Auto from excerpt"}
                      className={textareaCls}
                    />
                    <span className={`${bodyFont.className} text-[9px] text-white/20`}>{form.seo.metaDescription.length}/160 · blank = excerpt</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`${bodyFont.className} text-[10px] text-white/25`}>OG image URL</span>
                    <input
                      value={form.seo.ogImage}
                      onChange={(e) => setSeo("ogImage", e.target.value)}
                      placeholder={form.coverImage || "Blank = cover image"}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className={`${bodyFont.className} flex items-start gap-1.5 text-[10px] text-white/20 mt-1`}>
                  <Info className="w-3 h-3 shrink-0 mt-0.5" />
                  <p>SEO fields auto-populate from title / excerpt / cover image if left blank.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
