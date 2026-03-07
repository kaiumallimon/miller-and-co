"use client";

import { useState, useEffect, useCallback } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion, AnimatePresence } from "motion/react";
import {
  UserPlus, Trash2, KeyRound, Loader2, AlertCircle, CheckCircle2,
  X, Eye, EyeOff, ShieldAlert, Users, UserCheck, UserX,
  ToggleLeft, ToggleRight, Pencil,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } };

interface AdminAccount { uid: string; email: string; name: string; createdAt: string | null; lastLogin: string | null; active: boolean; }
type ToastState = { type: "success" | "error"; message: string } | null;

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

function EditDialog({ acc, onSave, onCancel, saving }: { acc: AdminAccount; onSave: (name: string) => void; onCancel: () => void; saving: boolean }) {
  const [editName, setEditName] = useState(acc.name);
  return (
    <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/75" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2, ease: EASE }}
        className="relative bg-[#141414] border border-white/10 p-6 w-full max-w-sm flex flex-col gap-5 z-10">
        <span className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#c8a96e]/30" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#c8a96e]/30" />
        <div className="flex items-start gap-3">
          <Pencil className="w-4.5 h-4.5 text-[#c8a96e] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className={`${headlineFont.className} text-white text-lg font-semibold`}>Edit Profile</p>
            <p className={`${bodyFont.className} text-white/40 text-sm mt-0.5`}>{acc.email}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>Display Name</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Full name"
            autoFocus
            className={`${bodyFont.className} w-full bg-[#1a1a1a] border border-white/8 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e] transition-colors duration-200`}
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className={`${bodyFont.className} flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold border border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 transition-all duration-200 cursor-pointer`}>Cancel</button>
          <button onClick={() => { if (editName.trim()) onSave(editName.trim()); }} disabled={saving || !editName.trim()}
            className={`${bodyFont.className} flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold bg-[#c8a96e]/15 border border-[#c8a96e]/30 text-[#c8a96e] hover:bg-[#c8a96e]/25 transition-all duration-200 disabled:opacity-40 cursor-pointer`}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ConfirmDialog({ email, onConfirm, onCancel, loading }: { email: string; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/75" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2, ease: EASE }}
        className="relative bg-[#141414] border border-white/10 p-6 w-full max-w-sm flex flex-col gap-5 z-10">
        <span className="absolute top-0 left-0 w-8 h-8 border-t border-l border-red-500/30" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-red-500/30" />
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className={`${headlineFont.className} text-white text-lg font-semibold`}>Confirm Deletion</p>
            <p className={`${bodyFont.className} text-white/40 text-sm mt-1`}>
              <span className="text-white/60">{email}</span> will be permanently removed and can no longer sign in.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className={`${bodyFont.className} flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold border border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 transition-all duration-200 cursor-pointer`}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`${bodyFont.className} flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all duration-200 disabled:opacity-40 cursor-pointer`}>
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/4">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-white/6 animate-pulse shrink-0" />
          <div className="flex flex-col gap-1">
            <div className="h-3 bg-white/6 rounded-sm animate-pulse w-28" />
            <div className="h-2.5 bg-white/6 rounded-sm animate-pulse w-36" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><div className="h-5 bg-white/6 rounded-sm animate-pulse w-16" /></td>
      <td className="px-5 py-4"><div className="h-3 bg-white/6 rounded-sm animate-pulse w-24" /></td>
      <td className="px-5 py-4"><div className="h-3 bg-white/6 rounded-sm animate-pulse w-24" /></td>
      <td className="px-5 py-4">
        <div className="flex gap-2">
          <div className="h-7 w-14 bg-white/6 rounded-sm animate-pulse" />
          <div className="h-7 w-24 bg-white/6 rounded-sm animate-pulse" />
          <div className="h-7 w-16 bg-white/6 rounded-sm animate-pulse" />
          <div className="h-7 w-16 bg-white/6 rounded-sm animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [creating, setCreating] = useState(false);
  const [togglingUid, setTogglingUid] = useState<string | null>(null);
  const [resettingUid, setResettingUid] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [deletingUid, setDeletingUid] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<AdminAccount | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const showToast = (type: "success" | "error", message: string) => setToast({ type, message });

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
  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const total = accounts.length;
  const activeCount = accounts.filter((a) => a.active).length;
  const inactiveCount = total - activeCount;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setCreating(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", `Account created for ${newEmail}`);
      setNewName(""); setNewEmail(""); setNewPassword(""); setShowForm(false);
      await fetchAccounts();
    } catch { showToast("error", "Failed to create account."); }
    finally { setCreating(false); }
  };

  const handleToggle = async (acc: AdminAccount) => {
    setTogglingUid(acc.uid);
    try {
      const res = await fetch(`/api/admin/accounts/${acc.uid}`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", `${acc.email} is now ${data.active ? "active" : "inactive"}.`);
      setAccounts((prev) => prev.map((a) => a.uid === acc.uid ? { ...a, active: data.active } : a));
    } catch { showToast("error", "Failed to update account."); }
    finally { setTogglingUid(null); }
  };

  const handleReset = async (acc: AdminAccount) => {
    setResettingUid(acc.uid);
    try {
      const res = await fetch(`/api/admin/accounts/${acc.uid}/reset-password`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", `Password reset email sent to ${acc.email}`);
    } catch { showToast("error", "Failed to send reset email."); }
    finally { setResettingUid(null); }
  };

  const handleEdit = async (name: string) => {
    if (!editTarget) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/accounts/${editTarget.uid}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", `Name updated to "${name}"`);
      setAccounts((prev) => prev.map((a) => a.uid === editTarget.uid ? { ...a, name } : a));
      setEditTarget(null);
    } catch { showToast("error", "Failed to update profile."); }
    finally { setSavingEdit(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingUid(deleteTarget.uid);
    try {
      const res = await fetch(`/api/admin/accounts/${deleteTarget.uid}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error); return; }
      showToast("success", `Account ${deleteTarget.email} deleted.`);
      setDeleteTarget(null);
      setAccounts((prev) => prev.filter((a) => a.uid !== deleteTarget.uid));
    } catch { showToast("error", "Failed to delete account."); }
    finally { setDeletingUid(null); }
  };

  const fmt = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
  };

  const inputClass = `${bodyFont.className} w-full bg-[#1a1a1a] border border-white/8 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e] transition-colors duration-200`;
  const actionBtn = (color: "gold" | "red" | "default") =>
    `${bodyFont.className} flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-[0.1em] uppercase font-semibold border transition-all duration-200 disabled:opacity-40 cursor-pointer ${
      color === "gold" ? "border-white/8 text-white/35 hover:text-[#c8a96e] hover:border-[#c8a96e]/30"
      : color === "red" ? "border-white/8 text-white/35 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/8"
      : "border-white/8 text-white/35 hover:text-white/60 hover:border-white/20"
    }`;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      <AnimatePresence>
        {deleteTarget && <ConfirmDialog email={deleteTarget.email} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={!!deletingUid} />}
      </AnimatePresence>
      <AnimatePresence>
        {editTarget && <EditDialog acc={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} saving={savingEdit} />}
      </AnimatePresence>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`${headlineFont.className} text-2xl font-semibold text-white leading-tight`}>
            Admin <span className="italic text-[#c8a96e]">Accounts</span>
          </h1>
          <p className={`${bodyFont.className} text-white/30 text-sm mt-0.5`}>
            Manage administrator access to the Miller &amp; Co. panel
          </p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className={`${bodyFont.className} shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer ${
            showForm ? "bg-white/6 text-white/40 border border-white/10" : "bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#c8a96e]/85"
          }`}>
          {showForm ? <><X className="w-3.5 h-3.5" />Cancel</> : <><UserPlus className="w-3.5 h-3.5" />Add Admin</>}
        </button>
      </div>

      <AnimatePresence>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
            <div className="relative bg-[#141414] border border-white/6 p-5">
              <span className="absolute top-0 left-0 w-7 h-7 border-t border-l border-[#c8a96e]/30" />
              <span className="absolute bottom-0 right-0 w-7 h-7 border-b border-r border-[#c8a96e]/30" />
              <p className={`${bodyFont.className} text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] font-semibold mb-4`}>New Admin Account</p>
              <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>Full Name</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="John Smith" required autoComplete="off" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>Email Address</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="admin@example.com" required autoComplete="off" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30`}>Password <span className="normal-case tracking-normal text-white/15">(min. 8)</span></label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required minLength={8} autoComplete="new-password" className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowPw((p) => !p)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors cursor-pointer">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-end">
                  <button type="submit" disabled={creating} className={`${bodyFont.className} w-full flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.15em] uppercase bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#c8a96e]/85 transition-all disabled:opacity-50 cursor-pointer`}>
                    {creating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating…</> : <><UserPlus className="w-3.5 h-3.5" />Create</>}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-3 gap-4">
        {[
          { icon: Users,     label: "Total Accounts", value: loading ? "—" : total,         gold: false },
          { icon: UserCheck, label: "Active",          value: loading ? "—" : activeCount,   gold: true  },
          { icon: UserX,     label: "Inactive",        value: loading ? "—" : inactiveCount, gold: false },
        ].map(({ icon: Icon, label, value, gold }) => (
          <motion.div key={label} variants={fadeUp} className="relative bg-[#141414] border border-white/6 px-5 py-4 flex items-center gap-4">
            {gold && <><span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#c8a96e]/25" /><span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#c8a96e]/25" /></>}
            <Icon className={`w-5 h-5 shrink-0 ${gold ? "text-[#c8a96e]" : "text-white/20"}`} />
            <div>
              <p className={`${bodyFont.className} text-xl font-semibold ${gold ? "text-[#c8a96e]" : "text-white"}`}>{value}</p>
              <p className={`${bodyFont.className} text-white/25 text-[11px] tracking-wide`}>{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="bg-[#141414] border border-white/6 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-180">
            <thead>
              <tr className="border-b border-white/6">
                    {["Administrator", "Status", "Created", "Last Login", "Actions"].map((h) => (
                  <th key={h} className={`${bodyFont.className} px-5 py-3 text-left text-[10px] tracking-[0.2em] uppercase text-white/25 font-semibold whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
              ) : accounts.length === 0 ? (
                <tr><td colSpan={5} className={`${bodyFont.className} px-5 py-16 text-center text-white/20 text-sm`}>No admin accounts found.</td></tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.uid} className="border-b border-white/4 hover:bg-white/2 transition-colors duration-150">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#c8a96e]/12 border border-[#c8a96e]/20 flex items-center justify-center shrink-0">
                          <span className={`${headlineFont.className} text-[#c8a96e] text-xs font-semibold`}>
                            {(acc.name || acc.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white/80 text-sm truncate max-w-50">{acc.name || <span className="text-white/30 italic">No name</span>}</span>
                          <span className="text-white/30 text-xs truncate max-w-50">{acc.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase font-semibold border ${
                        acc.active ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400" : "bg-white/4 border-white/10 text-white/25"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${acc.active ? "bg-emerald-400" : "bg-white/20"}`} />
                        {acc.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className={`${bodyFont.className} px-5 py-3.5 text-white/30 text-[13px] whitespace-nowrap`}>{fmt(acc.createdAt)}</td>
                    <td className={`${bodyFont.className} px-5 py-3.5 text-white/30 text-[13px] whitespace-nowrap`}>{fmt(acc.lastLogin)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditTarget(acc)} className={actionBtn("gold")}>
                          <Pencil className="w-3.5 h-3.5" />Edit
                        </button>
                        <button onClick={() => handleToggle(acc)} disabled={togglingUid === acc.uid} className={actionBtn("default")}>
                          {togglingUid === acc.uid ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : acc.active ? <ToggleRight className="w-3.5 h-3.5 text-emerald-400" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          {acc.active ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => handleReset(acc)} disabled={resettingUid === acc.uid} className={actionBtn("gold")}>
                          {resettingUid === acc.uid ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                          Reset
                        </button>
                        <button onClick={() => setDeleteTarget(acc)} className={actionBtn("red")}>
                          <Trash2 className="w-3.5 h-3.5" />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && accounts.length > 0 && (
          <div className={`${bodyFont.className} border-t border-white/6 px-5 py-2.5 text-[11px] text-white/20 flex items-center justify-between`}>
            <span>{total} account{total !== 1 ? "s" : ""} total</span>
            <span>{activeCount} active · {inactiveCount} inactive</span>
          </div>
        )}
      </div>
    </div>
  );
}
