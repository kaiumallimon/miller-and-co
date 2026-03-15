"use client";

import { headlineFont, bodyFont } from "@/lib/typographies";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

export default function CtaSection() {
  return (
    <section className="relative w-full bg-[#faf8f5] px-6 lg:px-10 py-20">
      <div className="relative max-w-7xl mx-auto">
      <AnimateIn direction="up" duration={0.7} className="relative bg-[#1a1a1a] overflow-hidden px-10 py-16 lg:px-20 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

          {/* Corner gold accents */}
          <span className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#c8a96e]" />
          <span className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#c8a96e]" />

          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#c8a96e08_0%,transparent_70%)] pointer-events-none" />

          {/* Text */}
          <StaggerContainer className="relative flex flex-col gap-4 max-w-xl" stagger={0.12} delayChildren={0.2}>
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c8a96e]" />
                <span className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.3em] uppercase`}>
                  Ready to Start?
                </span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <h2 className={`${headlineFont.className} text-white text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight`}>
                Take the First Step Toward{" "}
                <span className="italic text-[#c8a96e]">Your Future</span>
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className={`${bodyFont.className} text-white/70 text-base leading-relaxed`}>
                Book a confidential 30-minute consultation with our migration lawyers — AUD $220, available in-person at our Bondi Junction office or via Zoom. Clear, expert advice tailored to your situation.
              </p>
            </StaggerItem>
          </StaggerContainer>

          {/* Actions */}
          <AnimateIn direction="up" delay={0.45} duration={0.65} className="relative flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-4 shrink-0">
            <a
              href="/contact"
              className={`${bodyFont.className} flex py-3 px-6 text-xs font-bold tracking-[0.2em] uppercase bg-[#c8a96e] text-[#1a1a1a] border border-[#c8a96e] hover:bg-transparent hover:text-[#c8a96e] transition-all duration-300 rounded-none cursor-pointer`}
            >
              Book a Consultation
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
            <Button
              size="lg"
              variant="outline"
              className={`${bodyFont.className} text-xs font-bold tracking-[0.2em] uppercase bg-transparent border-white/20 text-white/60 hover:text-black hover:bg-white hover:border-white/40 transition-all duration-300 rounded-none cursor-pointer`}
              onClick={() => window.location.href = "tel:+61280956369"}
            >
              <Phone className="w-3.5 h-3.5 mr-1" />
              Call Us Now
            </Button>
          </AnimateIn>

        </AnimateIn>
      </div>
    </section>
  );
}
