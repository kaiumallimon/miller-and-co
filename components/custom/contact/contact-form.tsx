"use client";

import { useState } from "react";
import { bodyFont, headlineFont } from "@/lib/typographies";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { motion, AnimatePresence } from "motion/react";

const SUBJECTS = [
  "General Enquiry",
  "Employer Sponsored Visa (Sub 482 / 186)",
  "Skilled Visa (Sub 189 / 190 / 491)",
  "Partner / Family Visa",
  "Business & Investment Visa",
  "National Innovation Visa (Sub 858)",
  "Visa Refusal & ART Appeal",
  "Australian Citizenship",
  "Initial Consultation Booking",
  "Other",
];

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "loading" | "success" | "error";
type Variant = "light" | "dark";

export default function ContactForm({ variant = "light" }: { variant?: Variant }) {
  const dark = variant === "dark";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _honeypot: form.website }),  // map to API field
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const inputClass = dark
    ? `${bodyFont.className} w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-[#c8a96e] transition-colors duration-200`
    : `${bodyFont.className} w-full bg-white border border-[#1a1a1a]/10 px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#c8a96e] transition-colors duration-200`;

  const labelClass = `${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase ${
    dark ? "text-white/40" : "text-[#1a1a1a]/50"
  }`;

  return (
    <div className={`relative p-8 lg:p-10 ${
      dark
        ? "bg-[#141414] border border-white/8"
        : "bg-white border border-[#1a1a1a]/8"
    }`}>
      {/* Corner accent */}
      <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#c8a96e]" />
      <span className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#c8a96e]" />

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex flex-col items-center justify-center gap-5 py-16 text-center"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-[#c8a96e]/10 border border-[#c8a96e]/25">
              <CheckCircle className="w-6 h-6 text-[#c8a96e]" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className={`${headlineFont.className} text-2xl font-semibold ${
                dark ? "text-white" : "text-[#1a1a1a]"
              }`}>
                Message Sent
              </h3>
              <p className={`${bodyFont.className} text-base max-w-sm leading-relaxed ${
                dark ? "text-white/50" : "text-[#1a1a1a]/50"
              }`}>
                Thank you for reaching out. A member of our team will be in touch
                with you shortly.
              </p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className={`${bodyFont.className} text-[11px] font-semibold tracking-[0.2em] uppercase text-[#c8a96e] ${
                dark ? "hover:text-white" : "hover:text-[#1a1a1a]"
              } transition-colors duration-200 mt-2`}
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Honeypot — hidden from real users, traps bots */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="new-password"
              style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
            />

            <StaggerContainer className="flex flex-col gap-4" stagger={0.07} delayChildren={0.05}>

              {/* Name + Email */}
              <StaggerItem className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>
                    Full Name <span className="text-[#c8a96e]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>
                    Email Address <span className="text-[#c8a96e]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className={inputClass}
                  />
                </div>
              </StaggerItem>

              {/* Phone + Subject */}
              <StaggerItem className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+61 4xx xxx xxx"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>
                    Subject <span className="text-[#c8a96e]">*</span>
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className={`${inputClass} appearance-none cursor-pointer ${
                      dark ? "[&>option]:bg-[#1a1a1a] [&>option]:text-white/80" : ""
                    }`}
                  >
                    <option value="" disabled>Select a subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </StaggerItem>

              {/* Message */}
              <StaggerItem className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Message <span className="text-[#c8a96e]">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your visa situation or enquiry..."
                  required
                  rows={6}
                  className={`${inputClass} resize-none`}
                />
              </StaggerItem>

              {/* Error banner */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className={`${bodyFont.className} flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit + Privacy consent */}
              <StaggerItem className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  size="lg"
                  className={`${bodyFont.className} w-full sm:w-auto text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    dark
                      ? "bg-[#c8a96e] text-[#1a1a1a] border border-[#c8a96e] hover:bg-transparent hover:text-[#c8a96e]"
                      : "bg-[#1a1a1a] text-white border border-[#1a1a1a] hover:bg-[#c8a96e] hover:text-[#1a1a1a] hover:border-[#c8a96e]"
                  }`}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-3.5 h-3.5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Privacy consent notice */}
                <p className={`${bodyFont.className} text-[10px] leading-relaxed ${
                  dark ? "text-white/25" : "text-[#1a1a1a]/40"
                }`}>
                  By submitting this form you consent to Miller &amp; Co Lawyers &amp; Migration Agents Pty Ltd
                  collecting and using the personal information provided to respond to your enquiry and
                  deliver our legal services, in accordance with the{" "}
                  <a
                    href="/privacy-policy"
                    className={`underline underline-offset-2 transition-colors duration-200 ${
                      dark
                        ? "text-white/40 hover:text-[#c8a96e]"
                        : "text-[#1a1a1a]/60 hover:text-[#c8a96e]"
                    }`}
                  >
                    Privacy Act 1988 (Cth)
                  </a>{" "}
                  and our{" "}
                  <a
                    href="/privacy-policy"
                    className={`underline underline-offset-2 transition-colors duration-200 ${
                      dark
                        ? "text-white/40 hover:text-[#c8a96e]"
                        : "text-[#1a1a1a]/60 hover:text-[#c8a96e]"
                    }`}
                  >
                    Privacy Policy
                  </a>
                  . Your information will not be disclosed to third parties except as required by law or to
                  facilitate your immigration matter.
                </p>
              </StaggerItem>

            </StaggerContainer>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
