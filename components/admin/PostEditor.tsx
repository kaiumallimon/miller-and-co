"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Loader2, CheckCircle2, AlertCircle, X,
  Globe, FileText, Tag, Image as ImageIcon,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
interface PostData {
  title: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  tags: string[];
  coverImage: string;
}

type ToastState = { type: "success" | "error"; message: string } | null;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={`flex items-center gap-3 px-4 py-3 text-sm border ${
        type === "success" ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400" : "bg-red-950/40 border-red-500/20 text-red-400"
      }`}>
      {type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer"><X className="w-3.5 h-3.5" /></button>
    </motion.div>
  );
}

// ─── Field label ──────────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className={`${bodyFont.className} text-[10px] tracking-[0.2em] uppercase text-white/30 font-semibold flex items-center gap-1`}>
      {children}
      {required && <span className="text-[#c8a96e]">*</span>}
    </label>
  );
}

// ─── PostEditor ───────────────────────────────────────────────────────────────
export default function PostEditor({
  postId,
  initialData,
  fetchingInitial,
}: {
  postId?: string;
  initialData?: Partial<PostData>;
  fetchingInitial?: boolean;
}) {
  const router = useRouter();
  const isEdit = Boolean(postId);

  const [form, setForm] = useState<PostData>({
    title: initialData?.title ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    status: initialData?.status ?? "draft",
    tags: initialData?.tags ?? [],
    coverImage: initialData?.coverImage ?? "",
  });
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  // Sync when initial data loads (edit mode)
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title ?? "",
        excerpt: initialData.excerpt ?? "",
        content: initialData.content ?? "",
        status: initialData.status ?? "draft",
        tags: initialData.tags ?? [],
        coverImage: initialData.coverImage ?? "",
      });
    }
  }, [initialData]);

  const set = (field: keyof PostData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      set("tags", [...form.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => set("tags", form.tags.filter((t) => t !== tag));

  const handleSave = async (overrideStatus?: "draft" | "published") => {
    if (!form.title.trim()) {
      setToast({ type: "error", message: "Title is required." });
      return;
    }
    if (!form.content.trim()) {
      setToast({ type: "error", message: "Content is required." });
      return;
    }

    setSaving(true);
    const payload = { ...form, status: overrideStatus ?? form.status };

    try {
      let res: Response;
      if (isEdit) {
        res = await fetch(`/api/admin/blogs/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save.");

      setToast({ type: "success", message: isEdit ? "Post updated." : "Post created." });

      if (!isEdit) {
        setTimeout(() => router.push("/admin/blogs"), 800);
      } else {
        setForm((prev) => ({ ...prev, status: payload.status }));
      }
    } catch (err) {
      setToast({ type: "error", message: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `${bodyFont.className} w-full bg-[#1a1a1a] border border-white/8 text-white/80 text-sm px-4 py-3 placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40 transition-colors`;
  const textareaCls = `${inputCls} resize-none`;

  return (
    <div className={`${bodyFont.className} flex flex-col h-full`}>
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50 w-85 max-w-[calc(100vw-2rem)]">
        <AnimatePresence mode="wait">
          {toast && <Toast key="t" type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/blogs")}
            className="text-white/30 hover:text-white/70 transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className={`${headlineFont.className} text-lg font-semibold text-[#faf8f5]`}>
            {isEdit ? "Edit Post" : "New Post"}
          </h1>
          {isEdit && (
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${
              form.status === "published"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-white/6 text-white/30"
            }`}>
              {form.status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Save draft */}
          <button onClick={() => handleSave("draft")} disabled={saving}
            className={`${bodyFont.className} flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all cursor-pointer disabled:opacity-40`}>
            {saving && form.status === "draft" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            Draft
          </button>
          {/* Publish */}
          <button onClick={() => handleSave("published")} disabled={saving}
            className={`${bodyFont.className} flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#d4b87a] transition-colors cursor-pointer disabled:opacity-40`}>
            {saving && form.status === "published" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
            Publish
          </button>
        </div>
      </div>

      {/* Content */}
      {fetchingInitial ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label required>Title</Label>
              <input
                className={inputCls}
                placeholder="Post title…"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>

            {/* Excerpt */}
            <div className="flex flex-col gap-2">
              <Label>Excerpt</Label>
              <textarea
                className={textareaCls}
                rows={2}
                placeholder="Brief summary shown in listings…"
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <Label required>Content <span className="text-white/15 normal-case tracking-normal font-normal">— Markdown supported</span></Label>
              <textarea
                className={`${textareaCls} font-mono text-xs leading-relaxed`}
                rows={24}
                placeholder="Write your post content in Markdown…"
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
              />
            </div>

            {/* Cover image */}
            <div className="flex flex-col gap-2">
              <Label><ImageIcon className="w-3 h-3" /> Cover Image URL</Label>
              <input
                className={inputCls}
                placeholder="https://example.com/image.jpg"
                value={form.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
              />
              {form.coverImage && (
                <div className="mt-1 h-40 overflow-hidden border border-white/8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <Label><Tag className="w-3 h-3" /> Tags</Label>
              <div className="flex gap-2">
                <input
                  className={`${inputCls} flex-1`}
                  placeholder="Add tag and press Enter…"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                />
                <button onClick={addTag}
                  className="px-4 py-3 border border-white/8 text-white/40 hover:text-white/70 hover:border-white/20 text-xs transition-all cursor-pointer">
                  Add
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {form.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#c8a96e]/8 border border-[#c8a96e]/20 text-[#c8a96e] text-[11px]">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="opacity-50 hover:opacity-100 cursor-pointer">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
