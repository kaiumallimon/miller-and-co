"use client";

import { useState, useEffect, useCallback } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion, AnimatePresence } from "motion/react";
import {
  ScrollText, ChevronLeft, ChevronRight, AlertCircle,
  CheckCircle2, X, RefreshCw,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface LogEntry {
  id: string;
  action: string;
  category: "auth" | "admin" | "contact";
  actor: string;
  target: string | null;
  details: string | null;
  ip: string | null;
  createdAt: string | null;
}

type CategoryFilter = "all" | "auth" | "admin" | "contact";
type ToastState = { type: "success" | "error"; message: string } | null;

// ─── Category metadata ────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { label: string; bg: string; text: string }> = {
  auth:    { label: "Auth",    bg: "bg-blue-500/10",    text: "text-blue-400"    },
  admin:   { label: "Admin",   bg: "bg-amber-500/10",   text: "text-amber-400"   },
  contact: { label: "Contact", bg: "bg-emerald-500/10", text: "text-emerald-400" },
};

// ─── Action label prettifier ──────────────────────────────────────────────────
function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
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

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-white/4">
      <td className="px-4 py-3">
        <div className="h-3 bg-white/8 rounded-sm animate-pulse w-32" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 bg-white/8 rounded-sm animate-pulse w-16" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 bg-white/8 rounded-sm animate-pulse w-28" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 bg-white/6 rounded-sm animate-pulse w-36" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 bg-white/6 rounded-sm animate-pulse w-24" />
      </td>
      <td className="px-4 py-3 hidden xl:table-cell">
        <div className="h-3 bg-white/4 rounded-sm animate-pulse w-full" />
      </td>
    </tr>
  );
}

// ─── Category badge ───────────────────────────────────────────────────────────
function CategoryBadge({ category }: { category: string }) {
  const meta = CATEGORY_META[category] ?? {
    label: category,
    bg: "bg-white/8",
    text: "text-white/60",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${meta.bg} ${meta.text}`}
    >
      {meta.label}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [toast, setToast] = useState<ToastState>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = useCallback(
    async (pg = page, cat = category, silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const params = new URLSearchParams({ page: String(pg) });
        if (cat !== "all") params.set("category", cat);
        const res = await fetch(`/api/admin/logs?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to fetch logs.");
        setLogs(data.logs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        setToast({ type: "error", message: (err as Error).message });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, category]
  );

  useEffect(() => {
    fetchLogs(page, category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category]);

  function handleCategoryChange(cat: CategoryFilter) {
    setCategory(cat);
    setPage(1);
  }

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const FILTER_TABS: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "auth", label: "Auth" },
    { key: "admin", label: "Admin" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className={`${bodyFont.className} flex flex-col h-full`}>
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50 w-85 max-w-[calc(100vw-2rem)]">
        <AnimatePresence mode="wait">
          {toast && (
            <Toast
              key="toast"
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between px-6 py-5 border-b border-white/6 shrink-0"
      >
        <div className="flex items-center gap-3">
          <ScrollText className="w-5 h-5 text-[#c8a96e]" />
          <h1 className={`${headlineFont.className} text-xl font-semibold text-[#faf8f5]`}>
            Activity Logs
          </h1>
          {!loading && (
            <span className="text-xs text-white/30 font-mono ml-1">
              {total.toLocaleString()} entries
            </span>
          )}
        </div>
        <button
          onClick={() => fetchLogs(page, category, true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/50 hover:text-white/80 border border-white/8 hover:border-white/16 transition-all cursor-pointer disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05 }}
        className="flex items-center gap-1 px-6 py-3 border-b border-white/6 shrink-0 overflow-x-auto"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleCategoryChange(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              category === tab.key
                ? "bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/30"
                : "text-white/40 hover:text-white/70 border border-transparent hover:border-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-auto"
      >
        <table className="w-full min-w-180 text-sm">
          <thead>
            <tr className="border-b border-white/6">
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30 whitespace-nowrap w-44">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30 w-24">
                Category
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30">
                Action
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30">
                Actor
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30">
                Target
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase text-white/30 hidden xl:table-cell">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => <SkeletonRow key={i} />)
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-white/30">
                    <ScrollText className="w-8 h-8 opacity-30" />
                    <p className="text-sm">No logs found</p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="border-b border-white/4 hover:bg-white/2 transition-colors group"
                >
                  {/* Timestamp */}
                  <td className="px-4 py-3 text-white/40 text-xs font-mono whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <CategoryBadge category={log.category} />
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-white/80 font-medium text-xs whitespace-nowrap">
                    {formatAction(log.action)}
                  </td>

                  {/* Actor */}
                  <td className="px-4 py-3 text-white/50 text-xs truncate max-w-45">
                    {log.actor}
                  </td>

                  {/* Target */}
                  <td className="px-4 py-3 text-white/40 text-xs truncate max-w-40">
                    {log.target ?? "—"}
                  </td>

                  {/* Details */}
                  <td className="px-4 py-3 text-white/30 text-xs truncate max-w-70 hidden xl:table-cell">
                    {log.details ?? "—"}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between px-6 py-3 border-t border-white/6 shrink-0"
        >
          <span className="text-xs text-white/30">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 text-white/40 hover:text-white border border-white/8 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 text-white/40 hover:text-white border border-white/8 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
