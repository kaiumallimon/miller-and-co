"use client";

import { useState, useRef } from "react";
import { bodyFont, headlineFont } from "@/lib/typographies";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  AnimateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/AnimateIn";
import { motion, AnimatePresence } from "motion/react";
import ReCAPTCHA from "react-google-recaptcha";

const SUBJECTS = [
  "General Enquiry",
  "Employer Sponsored Visa (Sub 482 / 186)",
  "Skilled Visa (Sub 189 / 190 / 491)",
  "Partner / Family Visa",
  "Business & Investment Visa",
  "National Innovation Visa (Sub 858)",
  "Visa Refusal & ART Appeal",
  "Australian Citizenship",
  "Consultation Booking (AUD $220 / 30 min)",
  "Other",
];

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "loading" | "success" | "error";
type Variant = "light" | "dark";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

export default function ContactForm({
  variant = "light",
}: {
  variant?: Variant;
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const dark = variant === "dark";
  const [formStartedAt, setFormStartedAt] = useState<number>(() => Date.now());
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const recaptchaToken = recaptchaRef.current?.getValue();
      if (!recaptchaToken) {
        setErrorMsg("Please complete the reCAPTCHA verification.");
        setStatus("error");
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _honeypot: form.website,
          formStartedAt,
          recaptchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        website: "",
      });
      setFormStartedAt(Date.now());
      recaptchaRef.current?.reset();
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
    <div
      className={`relative p-8 lg:p-10 ${
        dark
          ? "bg-[#141414] border border-white/8"
          : "bg-white border border-[#1a1a1a]/8"
      }`}
    >
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
              <h3
                className={`${headlineFont.className} text-2xl font-semibold ${
                  dark ? "text-white" : "text-[#1a1a1a]"
                }`}
              >
                Message Sent
              </h3>
              <p
                className={`${bodyFont.className} text-base max-w-sm leading-relaxed ${
                  dark ? "text-white/50" : "text-[#1a1a1a]/50"
                }`}
              >
                Thank you for reaching out. A member of our team will be in
                touch with you shortly.
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
              style={{
                position: "absolute",
                left: "-9999px",
                top: "-9999px",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            />

            <StaggerContainer
              className="flex flex-col gap-4"
              stagger={0.07}
              delayChildren={0.05}
            >
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
                  <label className={labelClass}>Phone Number</label>
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
                      dark
                        ? "[&>option]:bg-[#1a1a1a] [&>option]:text-white/80"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
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


              {siteKey && (
                <StaggerItem>
                  <div className={`mt-2 flex justify-start w-full overflow-hidden sm:overflow-visible ${dark ? "theme-dark" : ""}`}>
                    <div className="transform origin-left scale-[0.85] min-[360px]:scale-95 sm:scale-100">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={siteKey}
                        theme={dark ? "dark" : "light"}
                      />
                    </div>
                  </div>
                </StaggerItem>
              )}

              {/* APP collection notice & Privacy Policy Checkbox */}
              <StaggerItem>
                <div
                  className={`border px-4 py-3 ${
                    dark
                      ? "border-white/10 bg-white/4"
                      : "border-[#1a1a1a]/12 bg-[#faf8f5]"
                  }`}
                >
                  <p
                    className={`${bodyFont.className} text-[11px] font-semibold tracking-[0.18em] uppercase mb-1.5 ${
                      dark ? "text-[#c8a96e]/85" : "text-[#756341]"
                    }`}
                  >
                    Privacy Notice
                  </p>
                  <p
                    className={`${bodyFont.className} text-[12px] leading-relaxed mb-4 ${
                      dark ? "text-white/35" : "text-[#1a1a1a]/55"
                    }`}
                  >
                    By submitting this form you consent to us collecting and using your personal information to assess your visa enquiry and contact you regarding migration services. Your information will be handled in accordance with our{" "}
                    <a
                      href="/privacy-policy"
                      className={`underline underline-offset-2 transition-colors duration-200 ${
                        dark
                          ? "text-white/55 hover:text-[#c8a96e]"
                          : "text-[#1a1a1a]/75 hover:text-[#c8a96e]"
                      }`}
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>

                  <label className="flex items-start gap-3 cursor-pointer group max-w-xl">
                    <div className="flex items-center h-4 mt-0.5">
                      <input
                        type="checkbox"
                        required
                        className={`w-4 h-4 rounded-none border outline-none focus:ring-0 focus:ring-offset-0 transition-colors duration-200 cursor-pointer accent-[#c8a96e] ${
                          dark
                            ? "bg-transparent border-white/30 checked:bg-[#c8a96e] checked:border-[#c8a96e]"
                            : "bg-transparent border-[#1a1a1a]/30 checked:bg-[#c8a96e] checked:border-[#c8a96e]"
                        }`}
                      />
                    </div>
                    <span className={`${bodyFont.className} text-sm leading-relaxed ${dark ? "text-white/70" : "text-[#1a1a1a]/70"}`}>
                      I agree to the{" "}
                      <span>Privacy Policy</span>
                    </span>
                  </label>
                </div>
              </StaggerItem>

              {/* Submit */}
              <StaggerItem>
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  size="lg"
                  className={`${bodyFont.className} w-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
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
              </StaggerItem>

              <StaggerItem>
                <p className={`${bodyFont.className} py-1 text-center text-sm leading-relaxed ${dark ? "text-white/70" : "text-[#1a1a1a]/70"}`} >We respond to all enquiries within 24 hours.</p>
              </StaggerItem>
            </StaggerContainer>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
