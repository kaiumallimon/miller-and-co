"use client";

import { useState, useEffect, useCallback } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion, AnimatePresence } from "motion/react";
import {
  UserPlus,
  Trash2,
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Mail,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminAccount {
  uid: string;
  email: string;
  createdAt: string | null;
  lastLogin: string | null;
}

type ToastType = "success" | "error";

// ─── Inline toast ─────────────────────────────────────────────────────────────
function Toast({ type, message, onClose }: { type: ToastType; message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: EASE }}
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
      <button onClick={onClose} className="text-current/50 hover:text-current transition-colors cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-[#141414] border border-white/10 p-6 w-full max-w-sm flex flex-col gap-5">
        <span className="absolute top-0 left-0 w-8 h-8 border-t border-l border-red-500/30" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-red-500/30" />

        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className={`${headlineFont.className} text-white text-lg font-semibold`}>
              Confirm Deletion
            </p>
            <p className={`${bodyFont.className} text-white/40 text-sm`}>{message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={`${bodyFont.className} flex-1 px-4 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60 transition-all duration-200 cursor-pointer`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`${bodyFont.className} flex-1 px-4 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all duration-200 disabled:opacity-40 cursor-pointer`}
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Delete"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);

  // Per-row actions
  const [resettingUid, setResettingUid] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [deletingUid, setDeletingUid] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = (type: ToastType, message: string) => setToast({ type, message });

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accounts");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAccounts(data.admins ?? []);
    } catch {
      showToast("error", "Failed to load admin accounts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", `Account created for ${newEmail}`);
      setNewEmail(""); setNewPassword(""); setShowForm(false);
      await fetchAccounts();
    } catch {
      showToast("error", "Failed to create account.");
    } finally {
      setCreating(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingUid(deleteTarget.uid);
    try {
      const res = await fetch(`/api/admin/accounts/${deleteTarget.uid}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", `Account ${deleteTarget.email} deleted.`);
      setDeleteTarget(null);
      await fetchAccounts();
    } catch {
      showToast("error", "Failed to delete account.");
    } finally {
      setDeletingUid(null);
    }
  };

  // ── Password reset ──────────────────────────────────────────────────────────
  const handleReset = async (uid: string, email: string) => {
    setResettingUid(uid);
    try {
      const res = await fetch(`/api/admin/accounts/${uid}/reset-password`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", `Password reset email sent to ${email}`);
    } catch {
      showToast("error", "Failed to send reset email.");
    } finally {
      setResettingUid(null);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const fmt = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const inputClass = `${bodyFont.className} w-full bg-[#1a1a1a] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e] transition-colors duration-200`;

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      {/* ── Confirm dialog ── */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            message={`"${deleteTarget.email}" will be permanently removed and can no longer log in.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={!!deletingUid}
          />
        )}
      </AnimatePresence>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-8">

        {/* ── Header ── */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] font-semibold">
              System
            </p>
            <h1 className={`${headlineFont.className} text-3xl md:text-4xl font-semibold text-white leading-tight`}>
              Admin <span className="italic text-[#c8a96e]">Accounts</span>
            </h1>
            <p className="text-white/30 text-sm mt-0.5">
              Manage administrator access to the Miller &amp; Co. panel
            </p>
          </div>

          <button
            onClick={() => setShowForm((v) => !v)}
            className={`${bodyFont.className} flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer ${
              showForm
                ? "bg-white/6 text-white/50 border border-white/10"
                : "bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#c8a96e]/85"
            }`}
          >
            {showForm ? (
              <><X className="w-3.5 h-3.5" /> Cancel</>
            ) : (
              <><UserPlus className="w-3.5 h-3.5" /> Add Admin</>
            )}
          </button>
        </motion.div>

        {/* ── Toast ── */}
        <AnimatePresence>
          {toast && (
            <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
          )}
        </AnimatePresence>

        {/* ── Create form ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="create-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="relative bg-[#141414] border border-white/6 p-6">
                <span className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#c8a96e]/30" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#c8a96e]/30" />

                <p className="text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] font-semibold mb-5">
                  New Admin Account
                </p>

                <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      autoComplete="off"
                      className={inputClass}
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>
                      Password <span className="normal-case tracking-normal text-white/20">(min. 8 chars)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit spans both cols */}
                  <div className="sm:col-span-2 flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={creating}
                      className={`${bodyFont.className} flex items-center gap-2 px-6 py-2.5 text-xs font-bold tracking-[0.15em] uppercase bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#c8a96e]/85 transition-all duration-200 disabled:opacity-50 cursor-pointer`}
                    >
                      {creating ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating…</>
                      ) : (
                        <><UserPlus className="w-3.5 h-3.5" /> Create Account</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Divider ── */}
        <motion.div variants={fadeUp} className="h-px bg-white/6" />

        {/* ── Accounts list ── */}
        <motion.div variants={stagger} className="flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-white/20">
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
              <span className={`${bodyFont.className} text-sm`}>Loading accounts…</span>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/20">
              <Mail className="w-8 h-8" />
              <p className={`${bodyFont.className} text-sm`}>No admin accounts found.</p>
            </div>
          ) : (
            accounts.map((account) => (
              <motion.div
                key={account.uid}
                variants={fadeUp}
                className="relative bg-[#141414] border border-white/6 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Avatar + info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#c8a96e]/12 border border-[#c8a96e]/25 flex items-center justify-center shrink-0">
                    <span className={`${headlineFont.className} text-[#c8a96e] text-sm font-semibold`}>
                      {account.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white/80 text-sm font-medium truncate">{account.email}</span>
                    <div className={`${bodyFont.className} flex items-center gap-3 mt-0.5`}>
                      <span className="text-white/25 text-[11px]">
                        Created {fmt(account.createdAt)}
                      </span>
                      {account.lastLogin && (
                        <>
                          <span className="text-white/15 text-[11px]">·</span>
                          <span className="text-white/25 text-[11px]">
                            Last login {fmt(account.lastLogin)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Reset password */}
                  <button
                    onClick={() => handleReset(account.uid, account.email)}
                    disabled={resettingUid === account.uid}
                    title="Send password reset email"
                    className={`${bodyFont.className} flex items-center gap-2 px-3 py-2 text-[11px] tracking-[0.12em] uppercase font-semibold border border-white/8 text-white/35 hover:text-[#c8a96e] hover:border-[#c8a96e]/30 transition-all duration-200 disabled:opacity-40 cursor-pointer`}
                  >
                    {resettingUid === account.uid ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <KeyRound className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">Reset Password</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(account)}
                    title="Delete account"
                    className={`${bodyFont.className} flex items-center gap-2 px-3 py-2 text-[11px] tracking-[0.12em] uppercase font-semibold border border-white/8 text-white/35 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/8 transition-all duration-200 cursor-pointer`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

      </motion.div>
    </div>
  );
}
