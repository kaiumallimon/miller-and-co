"use client";

import { headlineFont, bodyFont } from "@/lib/typographies";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative w-full bg-[#faf8f5] px-6 lg:px-10 pb-0 pt-24 lg:pt-32">
      <div className="relative max-w-7xl mx-auto">
        <div className="relative bg-[#1a1a1a] overflow-hidden px-10 py-16 lg:px-20 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

          {/* Corner gold accents */}
          <span className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#c8a96e]" />
          <span className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#c8a96e]" />

          {/* Subtle radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#c8a96e08_0%,_transparent_70%)] pointer-events-none" />

          {/* Text */}
          <div className="relative flex flex-col gap-4 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#c8a96e]" />
              <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                Ready to Start?
              </span>
            </div>
            <h2 className={`${headlineFont.className} text-white text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight`}>
              Take the First Step Toward{" "}
              <span className="italic text-[#c8a96e]">Your Future</span>
            </h2>
            <p className={`${bodyFont.className} text-white/50 text-sm leading-relaxed`}>
              Book a confidential consultation with our migration lawyers today.
              No obligation — just clear, expert advice tailored to your situation.
            </p>
          </div>

          {/* Actions */}
          <div className="relative flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-4 shrink-0">
            <Button
              size="lg"
              className={`${bodyFont.className} text-xs font-bold tracking-[0.2em] uppercase bg-[#c8a96e] text-[#1a1a1a] border border-[#c8a96e] hover:bg-transparent hover:text-[#c8a96e] transition-all duration-300 rounded-none cursor-pointer`}
              onClick={() => window.location.href = "mailto:info@visa-australia.legal"}
            >
              Book a Consultation
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`${bodyFont.className} text-xs font-bold tracking-[0.2em] uppercase bg-transparent border-white/20 text-white/60 hover:bg-white/5 hover:text-white hover:border-white/40 transition-all duration-300 rounded-none cursor-pointer`}
              onClick={() => window.location.href = "tel:+61280956369"}
            >
              <Phone className="w-3.5 h-3.5 mr-1" />
              Call Us Now
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
