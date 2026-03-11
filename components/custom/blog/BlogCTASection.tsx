"use client";

import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import ContactForm from "@/components/custom/contact/contact-form";
import { Mail } from "lucide-react";

export default function BlogCTASection() {
  return (
    <section className="relative w-full bg-[#0a0a0a] border-t border-white/6 px-6 lg:px-10 py-24">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#c8a96e07_0%,transparent_60%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-14 lg:gap-20 items-start">

          {/* ── Left: copy ──────────────────────────────────────────────── */}
          <StaggerContainer className="flex flex-col gap-6 lg:sticky lg:top-28" stagger={0.1} delayChildren={0.1}>

            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c8a96e]" />
                <span
                  className={`${bodyFont.className} text-[#c8a96e] text-[11px] font-semibold tracking-[0.3em] uppercase`}
                >
                  Get in Touch
                </span>
              </div>
            </StaggerItem>

            <StaggerItem>
              <h2
                className={`${headlineFont.className} text-white text-3xl sm:text-4xl font-semibold leading-tight`}
              >
                Have a question about{" "}
                <span className="italic text-[#c8a96e]">your visa?</span>
              </h2>
            </StaggerItem>

            <StaggerItem>
              <p
                className={`${bodyFont.className} text-white/50 text-sm leading-relaxed`}
              >
                Our migration lawyers are ready to help. Send us a message and
                we'll get back to you promptly with clear, expert guidance
                tailored to your situation.
              </p>
            </StaggerItem>

            {/* Contact info */}
            <StaggerItem>
              <div className="flex flex-col gap-3 pt-2">
                <div className={`${bodyFont.className} flex items-center gap-3`}>
                  <div className="w-8 h-8 bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-[#c8a96e]" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">
                      Email us
                    </p>
                    <a
                      href="mailto:info@millerandco.com.au"
                      className="text-xs text-white/70 hover:text-[#c8a96e] transition-colors"
                    >
                      info@visa-australia.legal
                    </a>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Decorative accent */}
            <StaggerItem>
              <div className="hidden lg:block mt-4 w-12 h-px bg-[#c8a96e]/30" />
            </StaggerItem>

          </StaggerContainer>

          {/* ── Right: form ─────────────────────────────────────────────── */}
          <AnimateIn direction="up" delay={0.2} duration={0.7}>
            <ContactForm variant="dark" />
          </AnimateIn>

        </div>
      </div>
    </section>
  );
}
