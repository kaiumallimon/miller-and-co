"use client";

import { useState, useEffect, useCallback } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, MailOpen, Trash2, Loader2, AlertCircle, CheckCircle2,
  X, ChevronLeft, ChevronRight, Phone, User, MessageSquare, Inbox,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string | null;
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
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="px-4 py-3.5 border-b border-white/4">
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-white/8 animate-pulse mt-1.5 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 bg-white/8 rounded-sm animate-pulse w-3/4" />
          <div className="h-2.5 bg-white/6 rounded-sm animate-pulse w-1/2" />
          <div className="h-2.5 bg-white/4 rounded-sm animate-pulse w-full" />
        </div>
        <div className="h-2.5 bg-white/6 rounded-sm animate-pulse w-16 shrink-0" />
      </div>
    </div>
  );
}

// ─── Message detail content ───────────────────────────────────────────────────
function MessageDetail({
  sub,
  onToggleRead,
  onDelete,
  togglingRead,
  deleting,
  onClose,
}: {
  sub: Submission;
  onToggleRead: () => void;
  onDelete: () => void;
  togglingRead: boolean;
  deleting: boolean;
  onClose?: () => void;
}) {
  const fmtFull = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString("en-AU", {
          day: "2-digit", month: "short", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : "—";

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/6 flex items-start justify-between gap-4 shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {!sub.read && <span className="w-2 h-2 rounded-full bg-[#c8a96e] shrink-0" />}
            <h2 className={`${headlineFont.className} text-white text-base font-semibold truncate leading-snug`}>
              {sub.subject}
            </h2>
          </div>
          <p className={`${bodyFont.className} text-white/25 text-xs`}>{fmtFull(sub.createdAt)}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors cursor-pointer shrink-0 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sender meta */}
      <div className="px-5 py-3.5 border-b border-white/6 flex flex-col gap-2 shrink-0">
        {[
          { icon: User,  label: "From",  value: sub.name },
          { icon: Mail,  label: "Email", value: sub.email },
          { icon: Phone, label: "Phone", value: sub.phone ?? "Not provided" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="w-3.5 h-3.5 text-white/20 shrink-0" />
            <span className={`${bodyFont.className} text-white/25 text-xs w-10 shrink-0`}>{label}</span>
            <span className={`${bodyFont.className} text-white/60 text-xs`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Message body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className={`${bodyFont.className} text-[10px] tracking-[0.2em] uppercase text-white/20 font-semibold mb-3`}>Message</p>
        <p className={`${bodyFont.className} text-white/55 text-sm leading-relaxed whitespace-pre-wrap`}>{sub.message}</p>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-white/6 flex gap-2.5 shrink-0">
        <button onClick={onToggleRead} disabled={togglingRead}
          className={`${bodyFont.className} flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase border transition-all duration-200 disabled:opacity-40 cursor-pointer ${
            sub.read
              ? "border-white/8 text-white/35 hover:text-white/60 hover:border-white/20"
              : "border-[#c8a96e]/30 text-[#c8a96e] bg-[#c8a96e]/6 hover:bg-[#c8a96e]/12"
          }`}>
          {togglingRead
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : sub.read
              ? <><MailOpen className="w-3.5 h-3.5" />Mark Unread</>
              : <><Mail className="w-3.5 h-3.5" />Mark Read</>}
        </button>
        <button onClick={onDelete} disabled={deleting}
          className={`${bodyFont.className} flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase border border-white/8 text-white/35 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/8 transition-all duration-200 disabled:opacity-40 cursor-pointer`}>
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Trash2 className="w-3.5 h-3.5" />Delete</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [togglingRead, setTogglingRead] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showToast = (type: "success" | "error", message: string) => setToast({ type, message });

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchSubmissions = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?page=${p}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSubmissions(data.submissions ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotal(data.total ?? 0);
    } catch {
      showToast("error", "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubmissions(page); }, [fetchSubmissions, page]);

  // Keep selected card in sync with list state
  useEffect(() => {
    if (selected) {
      const updated = submissions.find((s) => s.id === selected.id);
      if (updated) setSelected(updated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissions]);

  const unreadCount = submissions.filter((s) => !s.read).length;

  // ── Select card (auto-marks read) ───────────────────────────────────────────
  const handleSelect = async (sub: Submission) => {
    setSelected(sub);
    setDrawerOpen(true);
    if (!sub.read) {
      try {
        await fetch(`/api/admin/submissions/${sub.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });
        setSubmissions((prev) => prev.map((s) => s.id === sub.id ? { ...s, read: true } : s));
        setSelected((prev) => prev ? { ...prev, read: true } : prev);
      } catch { /* silent */ }
    }
  };

  // ── Toggle read ─────────────────────────────────────────────────────────────
  const handleToggleRead = async () => {
    if (!selected) return;
    setTogglingRead(true);
    const newRead = !selected.read;
    try {
      const res = await fetch(`/api/admin/submissions/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: newRead }),
      });
      if (!res.ok) throw new Error();
      setSubmissions((prev) => prev.map((s) => s.id === selected.id ? { ...s, read: newRead } : s));
      setSelected((prev) => prev ? { ...prev, read: newRead } : prev);
    } catch { showToast("error", "Failed to update."); }
    finally { setTogglingRead(false); }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/submissions/${selected.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSubmissions((prev) => prev.filter((s) => s.id !== selected.id));
      setTotal((t) => t - 1);
      setSelected(null);
      setDrawerOpen(false);
      showToast("success", "Submission deleted.");
    } catch { showToast("error", "Failed to delete."); }
    finally { setDeleting(false); }
  };

  const fmtDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="p-6 md:p-8 flex flex-col gap-5" style={{ height: "100%" }}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div>
          <h1 className={`${headlineFont.className} text-2xl font-semibold text-white leading-tight`}>
            Contact <span className="italic text-[#c8a96e]">Submissions</span>
          </h1>
          <p className={`${bodyFont.className} text-white/30 text-sm mt-0.5`}>
            Messages submitted through the website contact form
          </p>
        </div>
        {!loading && unreadCount > 0 && (
          <span className={`${bodyFont.className} shrink-0 mt-1 px-2.5 py-1 bg-[#c8a96e]/10 border border-[#c8a96e]/25 text-[#c8a96e] text-[11px] font-semibold`}>
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* ── Two-column layout ── */}
      <motion.div
        variants={fadeUp} initial="hidden" animate="visible"
        className="flex gap-4 flex-1 min-h-0"
      >
        {/* Left: message list */}
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 bg-[#141414] border border-white/6 flex flex-col min-h-0 overflow-hidden">

          {/* List header row */}
          <div className={`${bodyFont.className} px-4 py-2.5 border-b border-white/6 text-[10px] tracking-[0.2em] uppercase text-white/20 font-semibold shrink-0`}>
            {loading ? "Loading…" : `${total} submission${total !== 1 ? "s" : ""}`}
          </div>

          {/* Scrollable cards */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/15">
                <Inbox className="w-8 h-8" />
                <p className={`${bodyFont.className} text-sm`}>No submissions yet</p>
              </div>
            ) : (
              submissions.map((sub) => {
                const isSelected = selected?.id === sub.id;
                return (
                  <button key={sub.id} onClick={() => handleSelect(sub)}
                    className={`w-full text-left px-4 py-3.5 border-b border-white/4 transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-[#c8a96e]/6 border-l-2 border-l-[#c8a96e]"
                        : "hover:bg-white/[0.025] border-l-2 border-l-transparent"
                    }`}>
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 transition-colors ${sub.read ? "bg-transparent" : "bg-[#c8a96e]"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`${bodyFont.className} text-sm font-semibold truncate ${sub.read ? "text-white/45" : "text-white/85"}`}>
                            {sub.subject}
                          </p>
                          <span className={`${bodyFont.className} text-[10px] text-white/20 shrink-0 mt-0.5`}>{fmtDate(sub.createdAt)}</span>
                        </div>
                        <p className={`${bodyFont.className} text-xs text-white/30 mt-0.5`}>{sub.name} · {sub.email}</p>
                        <p className={`${bodyFont.className} text-xs text-white/20 mt-1 line-clamp-2 leading-relaxed`}>{sub.message}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-4 py-3 border-t border-white/6 flex items-center justify-between shrink-0">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 text-white/25 hover:text-white/60 disabled:opacity-25 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className={`${bodyFont.className} text-[11px] text-white/25`}>{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 text-white/25 hover:text-white/60 disabled:opacity-25 transition-colors cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: detail panel (desktop only, lg+) */}
        <div className="hidden lg:flex flex-1 bg-[#141414] border border-white/6 overflow-hidden min-h-0">
          {selected ? (
            <div className="w-full flex flex-col overflow-hidden">
              <MessageDetail
                sub={selected}
                onToggleRead={handleToggleRead}
                onDelete={handleDelete}
                togglingRead={togglingRead}
                deleting={deleting}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full gap-3 text-white/10 select-none">
              <MessageSquare className="w-10 h-10" />
              <p className={`${bodyFont.className} text-sm`}>Select a message to read</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Mobile bottom drawer ── */}
      <AnimatePresence>
        {drawerOpen && selected && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setDrawerOpen(false)} />

            <motion.div key="drawer"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#141414] border-t border-white/10 rounded-t-2xl flex flex-col overflow-hidden"
              style={{ maxHeight: "82dvh" }}>
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/15" />
              </div>
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <MessageDetail
                  sub={selected}
                  onToggleRead={handleToggleRead}
                  onDelete={handleDelete}
                  togglingRead={togglingRead}
                  deleting={deleting}
                  onClose={() => setDrawerOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
