"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail, MailOpen, Newspaper, HelpCircle, Users, ScrollText,
  Cloud, ArrowRight, RefreshCw, AlertCircle, TrendingUp,
  Inbox, PenLine, UserCheck, Star, Activity,
  CheckCircle2, Circle, ShieldCheck, Database, Cpu,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: EASE, delay: d },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface DashStats {
  submissions: { total: number; unread: number; recent: RecentSub[] };
  posts:       { total: number; published: number; drafts: number };
  faqs:        { total: number; onHome: number };
  accounts:    { total: number; active: number };
  logs:        { total: number; recent: RecentLog[] };
}

interface RecentSub {
  id: string; name: string; email: string; subject: string;
  read: boolean; createdAt: string | null;
}
interface RecentLog {
  id: string; action: string; category: string;
  actor: string; createdAt: string | null;
}

// ─── Skeleton primitives ───────────────────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="relative bg-[#141414] border border-white/6 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-white/7 rounded-sm animate-pulse" />
        <div className="w-8 h-8 bg-white/5 rounded-sm animate-pulse" />
      </div>
      <div className="h-7 w-16 bg-white/8 rounded-sm animate-pulse" />
      <div className="h-2.5 w-20 bg-white/5 rounded-sm animate-pulse" />
    </div>
  );
}

function RowSkeleton({ cols = 3 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/4">
      <div className="w-1.5 h-1.5 rounded-full bg-white/8 animate-pulse shrink-0" />
      <div className="flex-1 h-2.5 bg-white/8 rounded-sm animate-pulse" />
      {cols > 1 && <div className="w-1/3 h-2.5 bg-white/5 rounded-sm animate-pulse hidden sm:block" />}
      <div className="w-14 h-2 bg-white/5 rounded-sm animate-pulse shrink-0" />
    </div>
  );
}

// ─── Category badge ────────────────────────────────────────────────────────────
const CAT_META: Record<string, { bg: string; text: string }> = {
  auth:    { bg: "bg-blue-500/10",    text: "text-blue-400"    },
  admin:   { bg: "bg-amber-500/10",   text: "text-amber-400"   },
  contact: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
};

function CatBadge({ cat }: { cat: string }) {
  const m = CAT_META[cat] ?? { bg: "bg-white/5", text: "text-white/30" };
  return (
    <span className={`${bodyFont.className} text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 ${m.bg} ${m.text}`}>
      {cat}
    </span>
  );
}

function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function fmtAction(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, href, gold = false, badge, delay = 0,
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; href?: string; gold?: boolean; badge?: number; delay?: number;
}) {
  const inner = (
    <motion.div
      custom={delay}
      variants={fadeUp}
      className={`group relative bg-[#141414] border border-white/6 p-5 flex flex-col gap-3 h-full ${href ? "hover:border-[#c8a96e]/20 transition-colors duration-300 cursor-pointer" : ""}`}
    >
      {gold && (
        <>
          <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#c8a96e]/30" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#c8a96e]/30" />
        </>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 shrink-0 ${gold ? "text-[#c8a96e]" : "text-white/25"}`} />
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-semibold">
            {label}
          </span>
        </div>
        {badge != null && badge > 0 && (
          <span className="bg-[#c8a96e]/15 border border-[#c8a96e]/25 text-[#c8a96e] text-[9px] font-bold px-1.5 py-0.5 tracking-wider">
            {badge} new
          </span>
        )}
      </div>
      <p className={`${headlineFont.className} text-2xl font-semibold ${gold ? "text-[#c8a96e]" : "text-white"}`}>
        {value}
      </p>
      {sub && <p className="text-white/25 text-xs">{sub}</p>}
      {href && (
        <ArrowRight className="absolute bottom-4 right-4 w-3.5 h-3.5 text-[#c8a96e]/0 group-hover:text-[#c8a96e]/60 transition-colors duration-300" />
      )}
    </motion.div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

// ─── Quick link card ───────────────────────────────────────────────────────────
function QuickLink({ icon: Icon, label, sub, href, delay = 0 }: {
  icon: React.ElementType; label: string; sub: string; href: string; delay?: number;
}) {
  return (
    <motion.div custom={delay} variants={fadeUp}>
      <Link
        href={href}
        className="group flex items-center gap-4 bg-[#141414] border border-white/6 hover:border-[#c8a96e]/20 p-4 transition-colors duration-300"
      >
        <div className="w-8 h-8 bg-[#c8a96e]/8 border border-[#c8a96e]/15 flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-[#c8a96e]" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors font-medium truncate">{label}</p>
          <p className="text-[10px] text-white/25 truncate">{sub}</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-[#c8a96e]/60 transition-colors shrink-0" />
      </Link>
    </motion.div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [subRes, postRes, faqRes, acctRes, logRes] = await Promise.allSettled([
        fetch("/api/admin/submissions?page=1"),
        fetch("/api/admin/blogs"),
        fetch("/api/admin/faqs"),
        fetch("/api/admin/accounts"),
        fetch("/api/admin/logs?page=1"),
      ]);

      const get = async (r: PromiseSettledResult<Response>) => {
        if (r.status === "rejected") return null;
        const j = await r.value.json();
        return r.value.ok ? j : null;
      };

      const [subData, postData, faqData, acctData, logData] = await Promise.all([
        get(subRes), get(postRes), get(faqRes), get(acctRes), get(logRes),
      ]);

      const subs: RecentSub[] = subData?.submissions ?? [];
      const posts = postData?.posts ?? [];
      const faqs  = faqData?.faqs ?? [];
      const accts = acctData?.admins ?? [];
      const logs: RecentLog[] = logData?.logs ?? [];

      setStats({
        submissions: {
          total:  subData?.total ?? 0,
          unread: subs.filter((s) => !s.read).length,
          recent: subs.slice(0, 5),
        },
        posts: {
          total:     postData?.total ?? posts.length,
          published: posts.filter((p: { status: string }) => p.status === "published").length,
          drafts:    posts.filter((p: { status: string }) => p.status === "draft").length,
        },
        faqs: {
          total:  faqs.length,
          onHome: faqs.filter((f: { selectedForHome: boolean }) => f.selectedForHome).length,
        },
        accounts: {
          total:  accts.length,
          active: accts.filter((a: { active: boolean }) => a.active).length,
        },
        logs: {
          total:  logData?.total ?? 0,
          recent: logs.slice(0, 8),
        },
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const now   = new Date();
  const hour  = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className={`${bodyFont.className} flex flex-col h-full`}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-3">
          <Activity className="w-4.5 h-4.5 text-[#c8a96e]" />
          <h1 className={`${headlineFont.className} text-xl font-semibold text-[#faf8f5]`}>
            Dashboard
          </h1>
        </div>
        <button
          onClick={() => fetchAll(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider border border-white/8 text-white/30 hover:text-white/70 hover:border-white/20 transition-all cursor-pointer disabled:opacity-30"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8">

        {/* Greeting */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-1">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] font-semibold">Overview</p>
          <h2 className={`${headlineFont.className} text-3xl md:text-4xl font-semibold text-white`}>
            {greeting},{" "}
            <span className="italic text-[#c8a96e]">Admin</span>
          </h2>
          <p className="text-white/25 text-sm mt-0.5">
            {now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </motion.div>

        <div className="h-px bg-white/6" />

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-4 py-3 bg-red-950/30 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── KPI Stats ── */}
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-semibold mb-4">Key Metrics</p>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <StatCard icon={Mail}       label="Submissions"  value={stats?.submissions.total ?? 0}  href="/admin/submissions"  badge={stats?.submissions.unread}              gold  delay={0}    />
              <StatCard icon={Newspaper}  label="Published"    value={stats?.posts.published ?? 0}    href="/admin/blogs"        sub="blog posts"                                    delay={0.05} />
              <StatCard icon={PenLine}    label="Drafts"       value={stats?.posts.drafts ?? 0}       href="/admin/blogs"        sub="blog posts"                                    delay={0.1}  />
              <StatCard icon={HelpCircle} label="FAQs"         value={stats?.faqs.total ?? 0}         href="/admin/faqs"         sub={`${stats?.faqs.onHome ?? 0} on home`}    gold  delay={0.15} />
              <StatCard icon={UserCheck}  label="Admins"       value={stats?.accounts.total ?? 0}     href="/admin/accounts"     sub={`${stats?.accounts.active ?? 0} active`}       delay={0.2}  />
              <StatCard icon={ScrollText} label="Log Events"   value={stats?.logs.total ?? 0}         href="/admin/logs"         sub="total events"                                  delay={0.25} />
            </motion.div>
          )}
        </div>

        {/* ── Main two-col ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Submissions */}
          <div className="xl:col-span-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-semibold flex items-center gap-2">
                <Inbox className="w-3 h-3" /> Recent Submissions
              </p>
              <Link href="/admin/submissions" className="text-[10px] text-[#c8a96e]/60 hover:text-[#c8a96e] transition-colors uppercase tracking-wider flex items-center gap-1">
                View all <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
            <div className="bg-[#141414] border border-white/6">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} cols={3} />)
              ) : (stats?.submissions.recent ?? []).length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-white/20">
                  <Inbox className="w-8 h-8" />
                  <p className="text-sm">No submissions yet</p>
                </div>
              ) : (
                stats!.submissions.recent.map((sub, i) => (
                  <motion.div key={sub.id} custom={i * 0.05} variants={fadeUp} initial="hidden" animate="visible"
                    className="flex items-start gap-3 px-4 py-3.5 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                    <div className="mt-1 shrink-0">
                      {sub.read
                        ? <MailOpen className="w-3.5 h-3.5 text-white/20" />
                        : <Mail className="w-3.5 h-3.5 text-[#c8a96e]" />}
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <p className="text-sm text-white/75 font-medium truncate">{sub.name}</p>
                      <p className="text-xs text-white/30 truncate">{sub.subject}</p>
                    </div>
                    <div className="shrink-0 text-right flex flex-col gap-1 items-end">
                      <span className="text-[10px] text-white/20">{fmtTime(sub.createdAt)}</span>
                      {!sub.read && <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e]" />}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity Logs */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-semibold flex items-center gap-2">
                <ScrollText className="w-3 h-3" /> Recent Activity
              </p>
              <Link href="/admin/logs" className="text-[10px] text-[#c8a96e]/60 hover:text-[#c8a96e] transition-colors uppercase tracking-wider flex items-center gap-1">
                View all <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
            <div className="bg-[#141414] border border-white/6">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} cols={2} />)
              ) : (stats?.logs.recent ?? []).length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-white/20">
                  <Activity className="w-7 h-7" />
                  <p className="text-sm">No activity yet</p>
                </div>
              ) : (
                stats!.logs.recent.map((log, i) => (
                  <motion.div key={log.id} custom={i * 0.04} variants={fadeUp} initial="hidden" animate="visible"
                    className="flex items-start gap-3 px-4 py-3 border-b border-white/4 last:border-0">
                    <Circle className="w-1.5 h-1.5 text-[#c8a96e]/50 fill-[#c8a96e]/30 shrink-0 mt-1.5" />
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <p className="text-xs text-white/60 leading-snug truncate">{fmtAction(log.action)}</p>
                      <div className="flex items-center gap-1.5">
                        <CatBadge cat={log.category} />
                        <span className="text-[9px] text-white/20">{fmtTime(log.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Blog post breakdown ── */}
        {!loading && stats && stats.posts.total > 0 && (
          <motion.div custom={0.2} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-3">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-semibold flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Blog Post Status
            </p>
            <div className="bg-[#141414] border border-white/6 p-5 flex flex-col gap-5">
              {[
                { label: "Published", icon: CheckCircle2, color: "bg-emerald-400", textColor: "text-emerald-400", count: stats.posts.published },
                { label: "Drafts",    icon: PenLine,      color: "bg-amber-400",   textColor: "text-amber-400",   count: stats.posts.drafts    },
              ].map(({ label, icon: Icon, color, textColor, count }) => (
                <div key={label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`text-white/40 flex items-center gap-2`}>
                      <Icon className={`w-3.5 h-3.5 ${textColor}`} />
                      {label}
                    </span>
                    <span className="text-white/70 font-medium">{count} / {stats.posts.total}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.posts.total > 0 ? (count / stats.posts.total) * 100 : 0}%` }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                      className={`h-full ${color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Quick links ── */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-semibold">Quick Links</p>
          <motion.div variants={stagger} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <QuickLink icon={Newspaper}  label="All Blog Posts"       sub="Manage, edit or delete posts"     href="/admin/blogs"       delay={0}    />
            <QuickLink icon={PenLine}    label="New Blog Post"        sub="Write and publish a new article"  href="/admin/blogs/new"   delay={0.05} />
            <QuickLink icon={Mail}       label="Contact Submissions"  sub="Review incoming enquiries"        href="/admin/submissions" delay={0.1}  />
            <QuickLink icon={HelpCircle} label="FAQ Management"       sub="Edit home-page FAQ section"       href="/admin/faqs"        delay={0.15} />
            <QuickLink icon={Users}      label="Admin Accounts"       sub="Manage access and credentials"    href="/admin/accounts"    delay={0.2}  />
            <QuickLink icon={Cloud}      label="CDN / Media"          sub="Browse Cloudinary assets"         href="/admin/cdn"         delay={0.25} />
            <QuickLink icon={ScrollText} label="System Logs"          sub="Audit trail of all admin actions" href="/admin/logs"        delay={0.3}  />
          </motion.div>
        </div>

        {/* ── System status ── */}
        <motion.div custom={0.3} variants={fadeUp} initial="hidden" animate="visible">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 font-semibold mb-3">System Status</p>
          <div className="bg-[#141414] border border-white/6 p-5">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
              {[
                { icon: ShieldCheck, label: "Auth Provider",    value: "Firebase Authentication (Email / Password)" },
                { icon: Database,    label: "Database",         value: "Firestore — admins, contacts, posts, faqs, logs" },
                { icon: Cpu,         label: "Route Protection", value: "Middleware + getSessionUser() server helper" },
                { icon: Cloud,       label: "Media CDN",        value: "Cloudinary" },
                { icon: Star,        label: "Session Type",     value: "Browser session cookie — cleared on close" },
                { icon: Activity,    label: "Environment",      value: "Next.js App Router (Edge-compatible APIs)" },
              ].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="w-3.5 h-3.5 text-[#c8a96e]/50 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold">{label}</span>
                    <span className="text-xs text-white/50">{value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
