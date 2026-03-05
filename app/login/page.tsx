"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      // Step 1: sign in with Firebase Auth client SDK
      const credential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      // Step 2: get ID token and exchange for a server session cookie
      const idToken = await credential.user.getIdToken();
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Sign-in failed.");
        setStatus("error");
        return;
      }
      router.push("/admin");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      const msg =
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password"
          ? "Invalid email or password."
          : code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : "Sign-in failed. Please try again.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  const inputClass = `${bodyFont.className} w-full bg-[#1a1a1a] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#c8a96e] transition-colors duration-200`;

  return (
    <div className="relative min-h-screen w-full bg-[#0f0f0f] flex items-center justify-center overflow-hidden px-4">

      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#c8a96e07_0%,transparent_65%)] pointer-events-none" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#c8a96e 1px,transparent 1px),linear-gradient(90deg,#c8a96e 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Card */}
      <motion.div
        className="relative w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Corner accents */}
        <span className="absolute top-0 left-0 w-10 h-10 border-t border-l border-[#c8a96e]/40" />
        <span className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-[#c8a96e]/40" />

        <div className="bg-[#141414] border border-white/6 px-8 py-10 flex flex-col gap-8">

          {/* Logo + heading */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
            <Image
              src="/NEW-logo-TM-White1.png"
              alt="Miller & Co"
              width={150}
              height={42}
              className="object-contain"
            />
            <div className="w-full h-px bg-white/6" />
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className={`${headlineFont.className} text-white text-2xl font-semibold`}>
                Admin <span className="italic text-[#c8a96e]">Login</span>
              </h1>
              <p className={`${bodyFont.className} text-white/35 text-xs tracking-wide`}>
                Miller &amp; Co. — Restricted Access
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35`}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors duration-200"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${bodyFont.className} flex items-center gap-2.5 px-4 py-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs`}
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errorMsg}
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={status === "loading"}
              size="lg"
              className={`${bodyFont.className} w-full mt-2 text-xs font-bold tracking-[0.2em] uppercase bg-[#c8a96e] text-[#0f0f0f] hover:bg-[#c8a96e]/85 border-0 transition-all duration-300 rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Footer note */}
          <motion.p
            variants={itemVariants}
            className={`${bodyFont.className} text-center text-white/15 text-[10px] tracking-widest uppercase`}
          >
            Authorised Personnel Only
          </motion.p>

        </div>
      </motion.div>
    </div>
  );
}
