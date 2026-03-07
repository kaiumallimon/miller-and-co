"use client";

import { useState, useEffect, useCallback } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion } from "motion/react";
import {
  Cloud, HardDrive, Wifi, Zap, Image as ImageIcon,
  RefreshCw, AlertCircle, Eye, Lock,
  BarChart3,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
interface UsageStat {
  used: number;
  limit: number;
  usedPercent: number;
}

interface CdnStats {
  plan: string;
  storage: UsageStat;
  bandwidth: UsageStat;
  transformations: UsageStat;
  objects: UsageStat;
  credits: UsageStat;
}

interface CdnResource {
  publicId: string;
  url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  createdAt: string;
  folder: string;
}

interface CdnData {
  usage: CdnStats;
  resources: CdnResource[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ─── Usage card ───────────────────────────────────────────────────────────────
function UsageCard({
  label,
  icon: Icon,
  stat,
  formatFn,
  delay,
}: {
  label: string;
  icon: React.ElementType;
  stat: UsageStat;
  formatFn: (n: number) => string;
  delay: number;
}) {
  const pct = Math.min(stat.usedPercent, 100);
  const barColor =
    pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-400" : "bg-[#c8a96e]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
      className="flex flex-col gap-4 p-5 bg-[#141414] border border-white/6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-[#c8a96e]" />
          <span className={`${bodyFont.className} text-[10px] text-white/30 uppercase tracking-wider font-semibold`}>
            {label}
          </span>
        </div>
        <span className={`${bodyFont.className} text-[10px] font-semibold px-1.5 py-0.5 ${
          pct >= 90 ? "bg-red-500/10 text-red-400" :
          pct >= 70 ? "bg-amber-400/10 text-amber-400" :
          "bg-white/5 text-white/25"
        }`}>
          {pct.toFixed(1)}%
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-end justify-between">
          <span className={`${bodyFont.className} text-2xl text-[#faf8f5]`}>
            {formatFn(stat.used)}
          </span>
          <span className={`${bodyFont.className} text-xs text-white/25`}>
            / {formatFn(stat.limit)}
          </span>
        </div>
        <div className="w-full h-1 bg-white/6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + 0.2 }}
            className={`h-full ${barColor}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Resource thumb ───────────────────────────────────────────────────────────
function ResourceCard({ resource, delay }: { resource: CdnResource; delay: number }) {
  const name = resource.publicId.split("/").pop() ?? resource.publicId;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE, delay }}
      className="group flex flex-col bg-[#141414] border border-white/6 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#111] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resource.url}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
            title="Open full image"
          >
            <Eye className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1 p-3">
        <p className={`${bodyFont.className} text-[11px] text-white/60 truncate`} title={name}>
          {name}
        </p>
        <div className="flex items-center justify-between">
          <span className={`${bodyFont.className} text-[9px] text-white/25 uppercase tracking-wider`}>
            {resource.format} · {resource.width}×{resource.height}
          </span>
          <span className={`${bodyFont.className} text-[9px] text-white/25`}>
            {fmtBytes(resource.bytes)}
          </span>
        </div>
        <p className={`${bodyFont.className} text-[9px] text-white/15`}>
          {new Date(resource.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
      </div>
    </motion.div>
  );
}

// ─── CDN Management page ──────────────────────────────────────────────────────
export default function CdnManagementPage() {
  const [data, setData] = useState<CdnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cdn/stats");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load CDN stats");
      setData(json);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <div className={`${bodyFont.className} flex flex-col h-full`}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-3">
          <Cloud className="w-5 h-5 text-[#c8a96e]" />
          <h1 className={`${headlineFont.className} text-xl font-semibold text-[#faf8f5]`}>
            CDN Management
          </h1>
          <span className={`${bodyFont.className} flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-white/5 text-white/25 border border-white/8`}>
            <Lock className="w-2.5 h-2.5" />
            Read Only
          </span>
          {data?.usage?.plan && (
            <span className={`${bodyFont.className} text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-[#c8a96e]/8 text-[#c8a96e] border border-[#c8a96e]/20`}>
              {data.usage.plan}
            </span>
          )}
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing || loading}
          className={`${bodyFont.className} flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-white/8 text-white/30 hover:text-white/70 hover:border-white/20 transition-all cursor-pointer disabled:opacity-30`}
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        {loading ? (
          <div className="flex flex-col gap-8">
            {/* Usage cards skeleton */}
            <div className="flex flex-col gap-3">
              <div className="h-3 w-32 bg-white/6 rounded-sm animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4 p-5 bg-[#141414] border border-white/6">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-24 bg-white/8 rounded-sm animate-pulse" />
                      <div className="h-4 w-10 bg-white/5 rounded-sm animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-end justify-between">
                        <div className="h-7 w-20 bg-white/8 rounded-sm animate-pulse" />
                        <div className="h-3 w-14 bg-white/5 rounded-sm animate-pulse" />
                      </div>
                      <div className="w-full h-1 bg-white/6 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Resources grid skeleton */}
            <div className="flex flex-col gap-3">
              <div className="h-3 w-36 bg-white/6 rounded-sm animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex flex-col bg-[#141414] border border-white/6 overflow-hidden">
                    <div className="aspect-video bg-white/5 animate-pulse" />
                    <div className="flex flex-col gap-1.5 p-3">
                      <div className="h-2.5 w-3/4 bg-white/8 rounded-sm animate-pulse" />
                      <div className="h-2 w-1/2 bg-white/5 rounded-sm animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 h-64 text-red-400/70">
            <AlertCircle className="w-6 h-6" />
            <p className={`${bodyFont.className} text-sm`}>{error}</p>
            <button
              onClick={() => fetchStats()}
              className={`${bodyFont.className} text-xs text-[#c8a96e] hover:text-[#d4b87a] transition-colors cursor-pointer`}
            >
              Try again
            </button>
          </div>
        ) : data ? (
          <div className="flex flex-col gap-8">

            {/* ── Usage stats ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-white/25" />
                <span className={`${bodyFont.className} text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold`}>
                  Usage Statistics
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
                <UsageCard label="Storage" icon={HardDrive} stat={data.usage.storage} formatFn={fmtBytes} delay={0} />
                <UsageCard label="Bandwidth" icon={Wifi} stat={data.usage.bandwidth} formatFn={fmtBytes} delay={0.05} />
                <UsageCard label="Transformations" icon={Zap} stat={data.usage.transformations} formatFn={fmtNum} delay={0.1} />
                <UsageCard label="Objects" icon={ImageIcon} stat={data.usage.objects} formatFn={fmtNum} delay={0.15} />
                <UsageCard label="Credits" icon={Cloud} stat={data.usage.credits} formatFn={fmtNum} delay={0.2} />
              </div>
            </div>

            {/* ── Recent uploads ────────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-white/25" />
                <span className={`${bodyFont.className} text-[10px] text-white/25 uppercase tracking-[0.2em] font-semibold`}>
                  Recent Uploads
                </span>
                <span className={`${bodyFont.className} text-[10px] text-white/15`}>
                  · showing last {data.resources.length}
                </span>
              </div>

              {data.resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 h-40 border border-dashed border-white/6 text-white/20">
                  <ImageIcon className="w-6 h-6" />
                  <p className={`${bodyFont.className} text-xs`}>No images uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                  {data.resources.map((r, i) => (
                    <ResourceCard key={r.publicId} resource={r} delay={i * 0.03} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
