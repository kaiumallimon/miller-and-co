"use client";

import { useEffect, useState, useCallback } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import {
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Maximize2,
  SquareStack,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExpertiseItem {
  id: string;
  label: string;
  sub: string | null;
  order: number;
  isWide: boolean;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  accent,
}: {
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#141414] border border-white/5 p-5 flex flex-col gap-1">
      <span
        className={`${headlineFont.className} text-3xl font-semibold ${accent ? "text-[#c8a96e]" : "text-white"
          }`}
      >
        {value}
      </span>
      <span className={`${bodyFont.className} text-white/40 text-xs tracking-wide`}>
        {label}
      </span>
    </div>
  );
}

function EditModal({
  item,
  onClose,
  onSave,
}: {
  item: ExpertiseItem;
  onClose: () => void;
  onSave: (label: string, sub: string | null) => Promise<void>;
}) {
  const [label, setLabel] = useState(item.label);
  const [sub, setSub] = useState(item.sub ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    if (!label.trim()) { setErr("Label is required."); return; }
    setSaving(true);
    setErr("");
    await onSave(label.trim(), sub.trim() || null);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#141414] border border-white/8 w-full max-w-md p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className={`${headlineFont.className} text-white text-xl font-semibold`}>
            Edit Expertise Item
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={`${bodyFont.className} text-white/50 text-xs tracking-wide`}>
              Label <span className="text-[#c8a96e]">*</span>
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Partner Visas"
              className={`${bodyFont.className} bg-[#1a1a1a] border border-white/8 text-white text-sm px-4 py-2.5 outline-none focus:border-[#c8a96e]/40 placeholder:text-white/20 transition-colors`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={`${bodyFont.className} text-white/50 text-xs tracking-wide`}>
              Sub-label <span className="text-white/20 font-normal">(optional)</span>
            </label>
            <input
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              placeholder="e.g. Sub 820/801"
              className={`${bodyFont.className} bg-[#1a1a1a] border border-white/8 text-white text-sm px-4 py-2.5 outline-none focus:border-[#c8a96e]/40 placeholder:text-white/20 transition-colors`}
            />
          </div>
        </div>

        {err && (
          <p className={`${bodyFont.className} text-red-400 text-xs`}>{err}</p>
        )}

        <div className="flex gap-3 justify-end pt-1">
          <button
            onClick={onClose}
            className={`${bodyFont.className} text-white/40 hover:text-white text-sm px-4 py-2 border border-white/8 hover:border-white/20 transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className={`${bodyFont.className} bg-[#c8a96e] hover:bg-[#b8935a] text-black text-sm font-medium px-5 py-2 transition-colors disabled:opacity-60`}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteDialog({
  label,
  onClose,
  onConfirm,
}: {
  label: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#141414] border border-white/8 w-full max-w-sm p-6 flex flex-col gap-5">
        <h3 className={`${headlineFont.className} text-white text-xl font-semibold`}>
          Delete Item?
        </h3>
        <p className={`${bodyFont.className} text-white/50 text-sm leading-relaxed`}>
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">"{label}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className={`${bodyFont.className} text-white/40 hover:text-white text-sm px-4 py-2 border border-white/8 hover:border-white/20 transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className={`${bodyFont.className} bg-red-600/80 hover:bg-red-600 text-white text-sm font-medium px-5 py-2 transition-colors disabled:opacity-60`}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 text-sm ${bodyFont.className} ${type === "success"
          ? "bg-[#c8a96e] text-black"
          : "bg-red-600 text-white"
        } shadow-xl`}
    >
      {message}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExpertiseAdminPage() {
  const [items, setItems] = useState<ExpertiseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newSub, setNewSub] = useState("");
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState("");

  // Modals
  const [editItem, setEditItem] = useState<ExpertiseItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ExpertiseItem | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/expertise");
      const data = await res.json();
      if (res.ok) setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const wideItem = items.find((i) => i.isWide);
  const gridItems = items.filter((i) => !i.isWide);

  // ── Add ────────────────────────────────────────────────────────────────────
  async function handleAdd() {
    if (!newLabel.trim()) { setAddErr("Label is required."); return; }
    setAdding(true);
    setAddErr("");
    try {
      const res = await fetch("/api/admin/expertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim(), sub: newSub.trim() || null }),
      });
      if (res.ok) {
        setNewLabel("");
        setNewSub("");
        setShowAdd(false);
        await fetchItems();
        showToast("Expertise item added.");
      } else {
        const d = await res.json();
        setAddErr(d.error ?? "Failed to add.");
      }
    } finally {
      setAdding(false);
    }
  }

  // ── Patch helper ──────────────────────────────────────────────────────────
  async function patch(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/expertise/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  }

  // ── Wide toggle ───────────────────────────────────────────────────────────
  async function toggleWide(item: ExpertiseItem) {
    const next = !item.isWide;
    // Optimistic
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, isWide: next };
        if (next && i.isWide) return { ...i, isWide: false };
        return i;
      })
    );
    const ok = await patch(item.id, { isWide: next });
    if (!ok) {
      showToast("Failed to update.", "error");
      await fetchItems();
    } else {
      showToast(next ? "Set as wide item." : "Removed wide display.");
    }
  }

  // ── Reorder ───────────────────────────────────────────────────────────────
  async function reorder(item: ExpertiseItem, dir: "up" | "down") {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((i) => i.id === item.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const sibling = sorted[swapIdx];
    const newOrder = sibling.order;
    const siblingOrder = item.order;

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, order: newOrder };
        if (i.id === sibling.id) return { ...i, order: siblingOrder };
        return i;
      })
    );

    await Promise.all([
      patch(item.id, { order: newOrder }),
      patch(sibling.id, { order: siblingOrder }),
    ]);
  }

  // ── Edit save ─────────────────────────────────────────────────────────────
  async function handleEditSave(label: string, sub: string | null) {
    if (!editItem) return;
    const ok = await patch(editItem.id, { label, sub });
    if (ok) {
      setItems((prev) => prev.map((i) => i.id === editItem.id ? { ...i, label, sub } : i));
      showToast("Item updated.");
    } else {
      showToast("Failed to update.", "error");
    }
    setEditItem(null);
  }

  // ── Delete confirm ────────────────────────────────────────────────────────
  async function handleDeleteConfirm() {
    if (!deleteItem) return;
    const res = await fetch(`/api/admin/expertise/${deleteItem.id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
      showToast("Item deleted.");
    } else {
      showToast("Failed to delete.", "error");
    }
    setDeleteItem(null);
  }

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`${bodyFont.className} min-h-screen bg-[#0f0f0f] p-6 md:p-8 lg:p-10`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`${headlineFont.className} text-white text-3xl font-semibold`}>
            Expertise
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage the areas of expertise shown on the landing page.
          </p>
        </div>
        <button
          onClick={() => { setShowAdd((v) => !v); setAddErr(""); }}
          className="flex items-center gap-2 bg-[#c8a96e] hover:bg-[#b8935a] text-black text-sm font-medium px-4 py-2.5 transition-colors self-start sm:self-auto"
        >
          {showAdd ? <X size={15} /> : <Plus size={15} />}
          {showAdd ? "Cancel" : "Add Item"}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <StatCard value={items.length} label="Total Items" />
        <StatCard value={gridItems.length} label="Grid Items" />
        <StatCard
          value={wideItem ? "1 / 1" : "0 / 1"}
          label="Wide Item"
          accent={!!wideItem}
        />
      </div>

      {/* Wide-item info bar */}
      <div className="flex items-center gap-3 bg-[#141414] border border-white/5 px-4 py-3 mb-6">
        <Maximize2 size={14} className="text-[#c8a96e] shrink-0" />
        <p className="text-white/50 text-xs">
          One item can be designated as the <span className="text-[#c8a96e]">wide item</span> — it
          is displayed full-width at the bottom of the expertise grid. All others appear in the 3-column grid.
        </p>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#141414] border border-white/5 border-b-[#c8a96e]/30 p-5 mb-6 flex flex-col gap-4">
          <h2 className={`${headlineFont.className} text-white text-lg font-medium`}>
            New Expertise Item
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs tracking-wide">
                Label <span className="text-[#c8a96e]">*</span>
              </label>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Partner Visas"
                className="bg-[#1a1a1a] border border-white/8 text-white text-sm px-4 py-2.5 outline-none focus:border-[#c8a96e]/40 placeholder:text-white/20 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs tracking-wide">
                Sub-label <span className="text-white/20 font-normal">(optional)</span>
              </label>
              <input
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                placeholder="e.g. Sub 820/801"
                className="bg-[#1a1a1a] border border-white/8 text-white text-sm px-4 py-2.5 outline-none focus:border-[#c8a96e]/40 placeholder:text-white/20 transition-colors"
              />
            </div>
          </div>
          {addErr && <p className="text-red-400 text-xs">{addErr}</p>}
          <div className="flex justify-end">
            <button
              onClick={handleAdd}
              disabled={adding}
              className="bg-[#c8a96e] hover:bg-[#b8935a] text-black text-sm font-medium px-5 py-2.5 transition-colors disabled:opacity-60"
            >
              {adding ? "Adding…" : "Add Item"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-40 text-white/30 text-sm">
          Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-40 gap-3">
          <SquareStack size={32} className="text-white/10" />
          <p className="text-white/30 text-sm">No expertise items yet. Add one above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-white/5 border border-white/5">
          {sortedItems.map((item, idx) => (
            <div
              key={item.id}
              className="group relative flex items-center gap-3 bg-[#0f0f0f] hover:bg-[#141414] transition-colors px-4 py-4"
            >
              {/* Gold accent if wide */}
              {item.isWide && (
                <span className="absolute left-0 top-0 h-full w-0.5 bg-[#c8a96e]" />
              )}

              {/* Reorder */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => reorder(item, "up")}
                  disabled={idx === 0}
                  className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => reorder(item, "down")}
                  disabled={idx === sortedItems.length - 1}
                  className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Content */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <p className={`${headlineFont.className} text-white text-base font-medium truncate`}>
                  {item.label}
                </p>
                {item.sub && (
                  <span className="text-white/30 text-[10px] tracking-[0.18em] uppercase shrink-0">
                    {item.sub}
                  </span>
                )}
                {item.isWide && (
                  <span className="shrink-0 flex items-center gap-1 bg-[#c8a96e]/10 border border-[#c8a96e]/20 text-[#c8a96e] text-[9px] tracking-[0.15em] uppercase px-2 py-0.5">
                    <Maximize2 size={9} />
                    Wide
                  </span>
                )}
              </div>

              {/* Actions — appear on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {/* Wide toggle */}
                <button
                  onClick={() => toggleWide(item)}
                  title={item.isWide ? "Remove wide" : "Set as wide item"}
                  className={`p-1.5 rounded-sm transition-colors ${item.isWide
                      ? "text-[#c8a96e] hover:text-[#c8a96e]/60"
                      : "text-white/30 hover:text-[#c8a96e]"
                    }`}
                >
                  <Maximize2 size={14} />
                </button>
                <button
                  onClick={() => setEditItem(item)}
                  title="Edit"
                  className="p-1.5 text-white/30 hover:text-white rounded-sm transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteItem(item)}
                  title="Delete"
                  className="p-1.5 text-white/30 hover:text-red-400 rounded-sm transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEditSave}
        />
      )}
      {deleteItem && (
        <DeleteDialog
          label={deleteItem.label}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
