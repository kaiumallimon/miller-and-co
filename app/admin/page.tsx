"use client";

import { headlineFont } from "@/lib/typographies";
import { Mail, Clock, ShieldCheck, Database } from "lucide-react";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const stats = [
  { icon: Mail,        label: "Contact Form",  value: "Active",   sub: "SMTP connected",     gold: true },
  { icon: ShieldCheck, label: "Auth Status",    value: "Enabled",  sub: "Firebase Auth",       gold: true },
  { icon: Database,    label: "Admin Storage",  value: "Firestore", sub: "admins collection",  gold: false },
  { icon: Clock,       label: "Session",        value: "Browser",  sub: "Clears on close",     gold: false },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-10"
      >
        {/* Page heading */}
        <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] font-semibold">
            Overview
          </p>
          <h1
            className={`${headlineFont.className} text-3xl md:text-4xl font-semibold text-white leading-tight`}
          >
            Welcome <span className="italic text-[#c8a96e]">Back</span>
          </h1>
          <p className="text-white/30 text-sm mt-0.5">
            Miller &amp; Co. administration panel
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeUp} className="h-px bg-white/6" />

        {/* Stats grid */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map(({ icon: Icon, label, value, sub, gold }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="relative bg-[#141414] border border-white/6 p-5 flex flex-col gap-3"
            >
              {gold && (
                <>
                  <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#c8a96e]/30" />
                  <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#c8a96e]/30" />
                </>
              )}
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    gold ? "text-[#c8a96e]" : "text-white/30"
                  }`}
                />
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-semibold">
                  {label}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p
                  className={`${headlineFont.className} text-xl font-semibold ${
                    gold ? "text-[#c8a96e]" : "text-white"
                  }`}
                >
                  {value}
                </p>
                <p className="text-white/25 text-xs">{sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info panel */}
        <motion.div
          variants={fadeUp}
          className="bg-[#141414] border border-white/6 p-6 flex flex-col gap-4"
        >
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96e] font-semibold">
            System Info
          </p>
          <ul className="flex flex-col gap-2.5">
            {[
              ["Auth Provider", "Firebase Authentication (Email/Password)"],
              ["Session Type", "Browser session cookie — cleared on browser close"],
              ["Session Storage", "Firestore — admins collection (uid, email, lastLogin)"],
              ["Route Guard", "Next.js middleware + server-side session verification"],
              ["API Protection", "getSessionUser() helper — usable in any API route"],
            ].map(([key, val]) => (
              <li key={key} className="flex flex-col sm:flex-row sm:gap-3 text-sm">
                <span className="text-white/30 shrink-0 min-w-[180px]">{key}</span>
                <span className="text-white/70">{val}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
