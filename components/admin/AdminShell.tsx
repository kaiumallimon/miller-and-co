"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import {
  LayoutDashboard,
  Mail,
  Settings,
  LogOut,
  Loader2,
  Menu,
  X,
  ChevronRight,
  Users,
  ScrollText,
  Newspaper,
  PenLine,
  Cloud,
  HelpCircle,
  Layers,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

// ─── Nav structure ─────────────────────────────────────────────────────────────
const NAV = [
  {
    section: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true }],
  },
  {
    section: "Enquiries",
    items: [
      { label: "Contact Submissions", href: "/admin/submissions", icon: Mail, exact: false },
    ],
  },
  {
    section: "Blogs",
    items: [
      { label: "All Posts", href: "/admin/blogs", icon: Newspaper, exact: true },
      { label: "New Post", href: "/admin/blogs/new", icon: PenLine, exact: false },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, exact: false },
      { label: "Expertise", href: "/admin/expertise", icon: Layers, exact: false },
    ],
  },
  {
    section: "Media",
    items: [
      { label: "CDN Management", href: "/admin/cdn", icon: Cloud, exact: false },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Admin Accounts", href: "/admin/accounts", icon: Users, exact: false },
      { label: "Activity Logs", href: "/admin/logs", icon: ScrollText, exact: false },
      { label: "Settings", href: "/admin/settings", icon: Settings, exact: false },
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Sidebar inner content ─────────────────────────────────────────────────────
function SidebarContent({
  pathname,
  email,
  onLinkClick,
}: {
  pathname: string;
  email: string;
  onLinkClick?: () => void;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      await signOut(auth);
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <div className={`${bodyFont.className} flex h-full flex-col bg-[#0d0d0d] overflow-hidden`}>
      {/* Logo */}
      <div className="border-b border-white/6 px-5 py-5 shrink-0">
        <div className="flex items-center gap-3">
          <Image
            src="/NEW-logo-TM-White1.png"
            alt="Miller & Co."
            width={120}
            height={34}
            className="object-contain"
          />
          <span className="text-[9px] tracking-[0.25em] uppercase text-white/20 font-semibold border border-white/10 px-1.5 py-0.5">
            Admin
          </span>
        </div>
      </div>

      {/* Nav — scrollable */}
      <div className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 flex flex-col gap-5 [scrollbar-width:thin] [scrollbar-color:#c8a96e_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#c8a96e]">
        {NAV.map(({ section, items }) => (
          <div key={section} className="flex flex-col gap-1">
            <p className="text-[9px] tracking-[0.25em] uppercase text-white/20 font-semibold px-2 mb-1">
              {section}
            </p>
            {items.map(({ label, href, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onLinkClick}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 text-xs transition-all duration-200
                    ${active
                      ? "text-[#c8a96e]"
                      : "text-white/40 hover:text-white/80"
                    }`}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 bg-[#c8a96e]/8 border border-[#c8a96e]/20"
                      transition={{ duration: 0.25, ease: EASE }}
                    />
                  )}
                  <Icon className="w-4 h-4 shrink-0 relative z-10" />
                  <span className="relative z-10 font-medium tracking-wide truncate">{label}</span>
                  {active && (
                    <ChevronRight className="w-3 h-3 shrink-0 relative z-10 ml-auto text-[#c8a96e]/50" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/6 shrink-0" />

      {/* Footer — user + sign out */}
      <div className="px-3 py-4 shrink-0 flex flex-col gap-2">
        {/* Email */}
        <div className="px-3 py-2.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#c8a96e]/15 border border-[#c8a96e]/30 flex items-center justify-center shrink-0">
            <span className={`${headlineFont.className} text-[#c8a96e] text-xs font-semibold`}>
              {email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white/60 text-xs truncate">{email}</span>
            <span className="text-white/25 text-[10px] tracking-wide">Administrator</span>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200 disabled:opacity-40 cursor-pointer w-full text-left"
        >
          {loggingOut ? (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 shrink-0" />
          )}
          <span className="font-medium text-xs uppercase tracking-[0.15em]">
            {loggingOut ? "Signing out…" : "Sign Out"}
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Main shell ────────────────────────────────────────────────────────────────
export default function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className={`${bodyFont.className} flex h-screen w-screen bg-[#0f0f0f] overflow-hidden fixed inset-0`}>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 border-r border-white/6 shrink-0">
        <SidebarContent pathname={pathname} email={email} />
      </aside>

      {/* ── Mobile overlay + drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed inset-y-0 left-0 z-50 w-60 border-r border-white/6 md:hidden"
            >
              <SidebarContent
                pathname={pathname}
                email={email}
                onLinkClick={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between border-b border-white/6 bg-[#0d0d0d] px-4 py-3.5 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Image
            src="/NEW-logo-TM-White1.png"
            alt="Miller & Co."
            width={100}
            height={28}
            className="object-contain"
          />
          <div className="w-5" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
