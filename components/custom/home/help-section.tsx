"use client";

import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import CountUp from "@/components/CountUp";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { useParallax } from "@/hooks/useParallax";
import { motion } from "motion/react";

const highlights = [
  "Personalised visa strategy tailored to your goals",
  "End-to-end support from assessment to approval",
  "Transparent, fixed-fee legal advice",
];

export default function HelpSection() {
  const { ref: imgRef, y: imgY } = useParallax(45);
  return (
    <section className="relative w-full bg-[#faf8f5] overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#c8a96e10_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Text Content */}
          <StaggerContainer className="flex flex-col gap-7" stagger={0.12} delayChildren={0.05}>
            {/* Eyebrow */}
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c8a96e]" />
                <span
                  className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
                >
                  Expert Guidance
                </span>
              </div>
            </StaggerItem>

            {/* Heading */}
            <StaggerItem>
              <h2
                className={`${headlineFont.className} text-[#1a1a1a] text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-tight`}
              >
                Let Us Help You{" "}
                <span className="italic text-[#c8a96e]">Navigate</span> Your
                Migration Journey
              </h2>
            </StaggerItem>

            {/* Body */}
            <StaggerItem>
              <p
                className={`${bodyFont.className} text-[#1a1a1a]/60 text-sm leading-relaxed`}
              >
                Not sure which visa is right for you? Our experienced migration
                lawyers take the guesswork out of the process. We assess your
                situation, identify the best pathway, and handle every step — so
                you can focus on your future.
              </p>
            </StaggerItem>

            {/* Highlights */}
            <StaggerContainer className="flex flex-col gap-3 mt-1" stagger={0.1} delayChildren={0}>
              {highlights.map((item) => (
                <StaggerItem key={item}>
                  <div
                    className={`${bodyFont.className} flex items-start gap-3 text-sm text-[#1a1a1a]/70`}
                  >
                    <CheckCircle className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                    {item}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* CTA */}
            <StaggerItem>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                <Button
                  size="lg"
                  className={`${bodyFont.className} text-xs font-bold tracking-[0.2em] uppercase bg-[#1a1a1a] text-white hover:bg-[#c8a96e] hover:text-[#1a1a1a] border border-[#1a1a1a] hover:border-[#c8a96e] transition-all duration-300 rounded-none cursor-pointer`}
                  onClick={() =>
                    (window.location.href = "mailto:info@visa-australia.legal")
                  }
                >
                  Get in Touch
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Right: Image */}
          <AnimateIn direction="left" duration={0.8} delay={0.15} className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-145">
            {/* Gold border accent */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-[#c8a96e]/30 z-0" />

            <div ref={imgRef} className="relative w-full h-full overflow-hidden z-10">
              <motion.div
                style={{ y: imgY, position: "absolute", top: -45, bottom: -45, left: 0, right: 0 }}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/2.png"
                  alt="Miller & Co – Expert Migration Lawyers"
                  fill
                  className="object-cover object-center"
                />
              </motion.div>
              {/* Subtle gradient overlay on image */}
              <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a]/30 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <AnimateIn direction="up" delay={0.45} duration={0.65} className="absolute -bottom-6 -left-6 z-20 bg-[#1a1a1a] px-6 py-5 shadow-xl">
              <p className={`${bodyFont.className} text-[#c8a96e] text-3xl font-semibold`}>
                <CountUp to={500} duration={2.5} />+
              </p>
              <p className={`${bodyFont.className} text-white/60 text-[10px] tracking-[0.2em] uppercase mt-1`}>
                Successful Cases
              </p>
            </AnimateIn>
          </AnimateIn>

        </div>
      </div>
    </section>
  );
}
