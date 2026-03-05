"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion, AnimatePresence } from "motion/react";
import {
  Newspaper, PenLine, Trash2, Loader2, AlertCircle, CheckCircle2,
  X, Plus, Globe, FileText,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published";
  author: string;
  tags: string[];
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

type Filter = "all" | "published" | "draft";
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

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-white/4">
      <td className="px-4 py-3.5"><div className="h-3.5 bg-white/8 rounded-sm animate-pulse w-3/4" /></td>
      <td className="px-4 py-3.5"><div className="h-5 bg-white/8 rounded-sm animate-pulse w-20" /></td>
      <td className="px-4 py-3.5 hidden md:table-cell"><div className="h-3 bg-white/6 rounded-sm animate-pulse w-28" /></td>
      <td className="px-4 py-3.5 hidden lg:table-cell"><div className="h-3 bg-white/6 rounded-sm animate-pulse w-24" /></td>
      <td className="px-4 py-3.5"><div className="h-3 bg-white/4 rounded-sm animate-pulse w-16 ml-auto" /></td>
    </tr>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400">
      <Globe className="w-2.5 h-2.5" /> Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-white/6 text-white/30">
      <FileText className="w-2.5 h-2.5" /> Draft
    </span>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteModal({ title, onConfirm, onCancel, deleting }: {
  title: string; onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="bg-[#141414] border border-white/10 p-6 w-full max-w-sm flex flex-col gap-4">
        <div>
          <h3 className={`${headlineFont.className} text-white text-base font-semibold`}>Delete post?</h3>
          <p className={`${bodyFont.className} text-white/40 text-sm mt-1.5`}>
            &ldquo;{title}&rdquo; will be permanently removed.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} disabled={deleting}
            className={`${bodyFont.className} flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider border border-white/10 text-white/40 hover:text-white/70 transition-all cursor-pointer disabled:opacity-40`}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className={`${bodyFont.className} flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2`}>
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Trash2 className="w-3.5 h-3.5" />Delete</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState<ToastState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async (f: Filter = filter) => {
    setLoading(true);
    try {
      const params = f !== "all" ? `?status=${f}` : "";
      const res = await fetch(`/api/admin/blogs${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch.");
      setPosts(data.posts ?? []);
    } catch (err) {
      setToast({ type: "error", message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchPosts(filter); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts((p) => p.filter((x) => x.id !== deleteTarget.id));
      setToast({ type: "success", message: "Post deleted." });
      setDeleteTarget(null);
    } catch {
      setToast({ type: "error", message: "Failed to delete post." });
    } finally {
      setDeleting(false);
    }
  };

  function fmtDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Drafts" },
  ];

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    draft: posts.filter((p) => p.status === "draft").length,
  };

  return (
    <div className={`${bodyFont.className} flex flex-col h-full`}>
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50 w-85 max-w-[calc(100vw-2rem)]">
        <AnimatePresence mode="wait">
          {toast && <Toast key="toast" type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            title={deleteTarget.title}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="flex items-center justify-between px-6 py-5 border-b border-white/6 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <Newspaper className="w-5 h-5 text-[#c8a96e]" />
          <h1 className={`${headlineFont.className} text-xl font-semibold text-[#faf8f5]`}>All Posts</h1>
          {!loading && (
            <span className="text-xs text-white/30 font-mono ml-1">{posts.length} post{posts.length !== 1 ? "s" : ""}</span>
          )}
        </div>
        <button onClick={() => router.push("/admin/blogs/new")}
          className={`${bodyFont.className} flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#d4b87a] transition-colors cursor-pointer shrink-0`}>
          <Plus className="w-3.5 h-3.5" /> New Post
        </button>
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }}
        className="flex items-center gap-1 px-6 py-3 border-b border-white/6 shrink-0 overflow-x-auto">
        {FILTERS.map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filter === tab.key
                ? "bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/30"
                : "text-white/40 hover:text-white/70 border border-transparent hover:border-white/10"
            }`}>
            {tab.label}
            <span className={`text-[10px] font-mono ${filter === tab.key ? "text-[#c8a96e]/60" : "text-white/20"}`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
        className="flex-1 overflow-auto">
        <table className="w-full min-w-120 text-sm">
          <thead>
            <tr className="border-b border-white/6">
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30">Title</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30 w-28">Status</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30 w-32 hidden md:table-cell">Author</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30 w-32 hidden lg:table-cell">Date</th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold tracking-wider uppercase text-white/30 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-white/25">
                    <Newspaper className="w-8 h-8 opacity-30" />
                    <p className="text-sm">No posts yet</p>
                    <button onClick={() => router.push("/admin/blogs/new")}
                      className={`${bodyFont.className} flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#d4b87a] transition-colors cursor-pointer mt-1`}>
                      <Plus className="w-3.5 h-3.5" /> Write first post
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              posts.map((post, i) => (
                <motion.tr key={post.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="border-b border-white/4 hover:bg-white/2 transition-colors group">
                  <td className="px-4 py-3.5">
                    <p className="text-white/80 font-medium text-sm leading-snug line-clamp-1">{post.title}</p>
                    {post.excerpt && (
                      <p className="text-white/25 text-xs mt-0.5 line-clamp-1">{post.excerpt}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={post.status} /></td>
                  <td className="px-4 py-3.5 text-white/35 text-xs truncate hidden md:table-cell">{post.author}</td>
                  <td className="px-4 py-3.5 text-white/30 text-xs hidden lg:table-cell font-mono">
                    {post.status === "published" ? fmtDate(post.publishedAt) : fmtDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => router.push(`/admin/blogs/${post.id}/edit`)}
                        className="p-1.5 text-white/25 hover:text-[#c8a96e] border border-transparent hover:border-[#c8a96e]/20 transition-all cursor-pointer"
                        title="Edit">
                        <PenLine className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(post)}
                        className="p-1.5 text-white/25 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                        title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
