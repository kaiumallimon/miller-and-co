"use client";

import { useState, useEffect, useCallback } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus, Trash2, Loader2, AlertCircle, CheckCircle2, X,
  Star, Pencil, ChevronUp, ChevronDown, HelpCircle, Home,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } } };

const MAX_HOME = 5;

interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  selectedForHome: boolean;
  createdAt: string | null;
  updatedAt: string | null;
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

// ─── Edit modal ───────────────────────────────────────────────────────────────
function EditModal({
  faq,
  onSave,
  onCancel,
  saving,
}: {
  faq: Faq;
  onSave: (q: string, a: string) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [q, setQ] = useState(faq.question);
  const [a, setA] = useState(faq.answer);
  const inputCls = `${bodyFont.className} w-full bg-[#1a1a1a] border border-white/8 px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40 transition-colors resize-none`;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/75" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.22, ease: EASE }}
        className="relative bg-[#141414] border border-white/10 p-6 w-full max-w-lg flex flex-col gap-5 z-10">
        <span className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#c8a96e]/30" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#c8a96e]/30" />

        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-[#c8a96e] shrink-0" />
          <h3 className={`${headlineFont.className} text-white text-lg font-semibold`}>Edit FAQ</h3>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>Question</label>
          <textarea rows={2} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Question…" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>Answer</label>
          <textarea rows={5} value={a} onChange={(e) => setA(e.target.value)} placeholder="Answer…" className={inputCls} />
        </div>

        <div className="flex gap-3 mt-1">
          <button onClick={onCancel}
            className={`${bodyFont.className} flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold border border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 transition-all cursor-pointer`}>
            Cancel
          </button>
          <button onClick={() => { if (q.trim() && a.trim()) onSave(q.trim(), a.trim()); }}
            disabled={saving || !q.trim() || !a.trim()}
            className={`${bodyFont.className} flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold bg-[#c8a96e]/15 border border-[#c8a96e]/30 text-[#c8a96e] hover:bg-[#c8a96e]/25 transition-all disabled:opacity-40 cursor-pointer`}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Delete confirm dialog ────────────────────────────────────────────────────
function DeleteDialog({
  question,
  onConfirm,
  onCancel,
  loading,
}: {
  question: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/75" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2, ease: EASE }}
        className="relative bg-[#141414] border border-white/10 p-6 w-full max-w-sm flex flex-col gap-5 z-10">
        <span className="absolute top-0 left-0 w-8 h-8 border-t border-l border-red-500/30" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-red-500/30" />
        <div>
          <p className={`${headlineFont.className} text-white text-lg font-semibold`}>Delete FAQ?</p>
          <p className={`${bodyFont.className} text-white/40 text-sm mt-1 line-clamp-2`}>&ldquo;{question}&rdquo;</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className={`${bodyFont.className} flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold border border-white/10 text-white/40 hover:text-white/60 transition-all cursor-pointer`}>Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className={`${bodyFont.className} flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all disabled:opacity-40 cursor-pointer`}>
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-start gap-4 px-5 py-4 border-b border-white/4">
      <div className="w-5 h-5 bg-white/6 rounded animate-pulse shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 bg-white/6 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-white/6 rounded animate-pulse w-full" />
        <div className="h-3 bg-white/6 rounded animate-pulse w-2/3" />
      </div>
      <div className="flex gap-1.5 shrink-0">
        <div className="w-7 h-7 bg-white/6 rounded animate-pulse" />
        <div className="w-7 h-7 bg-white/6 rounded animate-pulse" />
        <div className="w-7 h-7 bg-white/6 rounded animate-pulse" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FaqsAdminPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [creating, setCreating] = useState(false);
  const [editTarget, setEditTarget] = useState<Faq | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const showToast = (type: "success" | "error", message: string) => setToast({ type, message });

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faqs");
      const data = await res.json();
      setFaqs(data.faqs ?? []);
    } catch {
      showToast("error", "Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const selectedCount = faqs.filter((f) => f.selectedForHome).length;
  const inputCls = `${bodyFont.className} w-full bg-[#1a1a1a] border border-white/8 px-4 py-2.5 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e]/40 transition-colors resize-none`;

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQ, answer: newA }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", "FAQ created.");
      setNewQ(""); setNewA(""); setShowForm(false);
      await fetchFaqs();
    } catch { showToast("error", "Failed to create FAQ."); }
    finally { setCreating(false); }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const handleEdit = async (question: string, answer: string) => {
    if (!editTarget) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/faqs/${editTarget.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", "FAQ updated.");
      setFaqs((prev) => prev.map((f) => f.id === editTarget.id ? { ...f, question, answer } : f));
      setEditTarget(null);
    } catch { showToast("error", "Failed to update FAQ."); }
    finally { setSavingEdit(false); }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const res = await fetch(`/api/admin/faqs/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", "FAQ deleted.");
      setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch { showToast("error", "Failed to delete FAQ."); }
    finally { setDeletingId(null); }
  };

  // ── Toggle selectedForHome ────────────────────────────────────────────────
  const handleToggleHome = async (faq: Faq) => {
    setTogglingId(faq.id);
    const newVal = !faq.selectedForHome;
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedForHome: newVal }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      setFaqs((prev) => prev.map((f) => f.id === faq.id ? { ...f, selectedForHome: newVal } : f));
      showToast("success", newVal ? "Added to home page." : "Removed from home page.");
    } catch { showToast("error", "Failed to update."); }
    finally { setTogglingId(null); }
  };

  // ── Reorder ───────────────────────────────────────────────────────────────
  const handleReorder = async (faq: Faq, direction: "up" | "down") => {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((f) => f.id === faq.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const swapTarget = sorted[swapIdx];
    setReorderingId(faq.id);
    try {
      await Promise.all([
        fetch(`/api/admin/faqs/${faq.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: swapTarget.order }),
        }),
        fetch(`/api/admin/faqs/${swapTarget.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: faq.order }),
        }),
      ]);
      setFaqs((prev) =>
        prev.map((f) => {
          if (f.id === faq.id) return { ...f, order: swapTarget.order };
          if (f.id === swapTarget.id) return { ...f, order: faq.order };
          return f;
        }).sort((a, b) => a.order - b.order)
      );
    } catch { showToast("error", "Failed to reorder."); }
    finally { setReorderingId(null); }
  };

  const sortedFaqs = [...faqs].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      {/* Dialogs */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteDialog question={deleteTarget.question} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={!!deletingId} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editTarget && (
          <EditModal faq={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} saving={savingEdit} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className={`${headlineFont.className} text-2xl font-semibold text-white leading-tight`}>
            FAQ <span className="italic text-[#c8a96e]">Management</span>
          </h1>
          <p className={`${bodyFont.className} text-white/30 text-sm mt-0.5`}>
            Manage frequently asked questions · up to {MAX_HOME} shown on the landing page
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={`${bodyFont.className} shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase transition-all cursor-pointer ${
            showForm ? "bg-white/6 text-white/40 border border-white/10" : "bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#c8a96e]/85"
          }`}
        >
          {showForm ? <><X className="w-3.5 h-3.5" />Cancel</> : <><Plus className="w-3.5 h-3.5" />Add FAQ</>}
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: HelpCircle, label: "Total FAQs",      value: loading ? "—" : faqs.length,    gold: false },
          { icon: Home,       label: "On Home Page",    value: loading ? "—" : selectedCount,  gold: true  },
          { icon: Star,       label: "Slots Remaining", value: loading ? "—" : Math.max(0, MAX_HOME - selectedCount), gold: false },
        ].map(({ icon: Icon, label, value, gold }) => (
          <motion.div key={label} variants={fadeUp} className="relative bg-[#141414] border border-white/6 px-5 py-4 flex items-center gap-4">
            {gold && <><span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#c8a96e]/25" /><span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#c8a96e]/25" /></>}
            <Icon className={`w-5 h-5 shrink-0 ${gold ? "text-[#c8a96e]" : "text-white/20"}`} />
            <div>
              <p className={`${headlineFont.className} text-xl font-semibold ${gold ? "text-[#c8a96e]" : "text-white"}`}>{value}</p>
              <p className={`${bodyFont.className} text-white/25 text-[11px] tracking-wide`}>{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add FAQ form */}
      <AnimatePresence>
        {showForm && (
          <motion.div key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
            <div className="relative bg-[#141414] border border-white/6 p-5">
              <span className="absolute top-0 left-0 w-7 h-7 border-t border-l border-[#c8a96e]/30" />
              <span className="absolute bottom-0 right-0 w-7 h-7 border-b border-r border-[#c8a96e]/30" />
              <p className={`${bodyFont.className} text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] font-semibold mb-4`}>New FAQ</p>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>Question <span className="text-[#c8a96e]">*</span></label>
                  <textarea rows={2} value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="e.g. Is there a guarantee of success?" required className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>Answer <span className="text-[#c8a96e]">*</span></label>
                  <textarea rows={4} value={newA} onChange={(e) => setNewA(e.target.value)} placeholder="Write a clear, concise answer…" required className={inputCls} />
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={creating}
                    className={`${bodyFont.className} flex items-center gap-2 px-6 py-2.5 text-xs font-bold tracking-[0.15em] uppercase bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#c8a96e]/85 transition-all disabled:opacity-50 cursor-pointer`}>
                    {creating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating…</> : <><Plus className="w-3.5 h-3.5" />Create FAQ</>}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home-page selection hint */}
      <div className={`${bodyFont.className} flex items-start gap-2.5 px-4 py-3 bg-[#c8a96e]/5 border border-[#c8a96e]/15`}>
        <Star className="w-3.5 h-3.5 text-[#c8a96e] shrink-0 mt-0.5" />
        <p className="text-[11px] text-white/40 leading-relaxed">
          <span className="text-[#c8a96e] font-semibold">{selectedCount}/{MAX_HOME}</span> FAQs selected for the home page.
          {selectedCount >= MAX_HOME
            ? " You've reached the limit — deselect one before adding another."
            : ` Select up to ${MAX_HOME - selectedCount} more using the star icon.`
          }
        </p>
      </div>

      {/* FAQ list */}
      <div className="bg-[#141414] border border-white/6 overflow-hidden">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
        ) : sortedFaqs.length === 0 ? (
          <div className={`${bodyFont.className} px-5 py-16 text-center text-white/20 text-sm flex flex-col items-center gap-3`}>
            <HelpCircle className="w-8 h-8 text-white/10" />
            No FAQs yet. Add your first one above.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {sortedFaqs.map((faq, idx) => (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={`flex items-start gap-4 px-5 py-4 border-b border-white/4 last:border-b-0 hover:bg-white/2 transition-colors group ${
                  faq.selectedForHome ? "bg-[#c8a96e]/3" : ""
                }`}
              >
                {/* Order controls */}
                <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
                  <button
                    onClick={() => handleReorder(faq, "up")}
                    disabled={idx === 0 || reorderingId === faq.id}
                    className="p-0.5 text-white/15 hover:text-white/50 disabled:opacity-0 transition-colors cursor-pointer"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleReorder(faq, "down")}
                    disabled={idx === sortedFaqs.length - 1 || reorderingId === faq.id}
                    className="p-0.5 text-white/15 hover:text-white/50 disabled:opacity-0 transition-colors cursor-pointer"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Star toggle */}
                <button
                  onClick={() => handleToggleHome(faq)}
                  disabled={togglingId === faq.id || (!faq.selectedForHome && selectedCount >= MAX_HOME)}
                  title={faq.selectedForHome ? "Remove from home page" : selectedCount >= MAX_HOME ? "Max 5 reached" : "Add to home page"}
                  className={`mt-0.5 shrink-0 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                    faq.selectedForHome ? "text-[#c8a96e]" : "text-white/15 hover:text-white/40"
                  }`}
                >
                  {togglingId === faq.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Star className={`w-4 h-4 ${faq.selectedForHome ? "fill-[#c8a96e]" : ""}`} />
                  }
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <p className={`${bodyFont.className} text-white/80 text-sm font-medium leading-snug`}>
                    {faq.question}
                    {faq.selectedForHome && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/20 align-middle">
                        <Home className="w-2.5 h-2.5" />Home
                      </span>
                    )}
                  </p>
                  <p className={`${bodyFont.className} text-white/30 text-xs leading-relaxed line-clamp-2`}>
                    {faq.answer}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditTarget(faq)}
                    title="Edit"
                    className="p-1.5 text-white/25 hover:text-[#c8a96e] hover:bg-[#c8a96e]/8 transition-all cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(faq)}
                    title="Delete"
                    className="p-1.5 text-white/25 hover:text-red-400 hover:bg-red-500/8 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {!loading && sortedFaqs.length > 0 && (
          <div className={`${bodyFont.className} border-t border-white/6 px-5 py-2.5 text-[11px] text-white/20 flex items-center justify-between`}>
            <span>{faqs.length} FAQ{faqs.length !== 1 ? "s" : ""} total</span>
            <span>{selectedCount}/{MAX_HOME} on home page</span>
          </div>
        )}
      </div>
    </div>
  );
}
