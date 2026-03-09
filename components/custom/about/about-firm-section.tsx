"use client";

import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { CheckCircle } from "lucide-react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { useParallax } from "@/hooks/useParallax";
import { motion } from "motion/react";

const highlights = [
  "Over 10,000 completed migration cases",
  "Led by a registered Australian Migration Lawyer",
  "Expert across all major visa categories",
  "Strong focus on compliance with Australian immigration law",
  "Transparent, client-first approach on every case",
];

export default function AboutFirmSection() {
  const { ref: imgRef, y: imgY } = useParallax(45);

  return (
    <section className="relative w-full bg-[#faf8f5] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#c8a96e10_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Text */}
          <StaggerContainer className="flex flex-col gap-7" stagger={0.12} delayChildren={0.05}>

            {/* Eyebrow */}
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#756341]" />
                <span className={`${bodyFont.className} text-[#756341] text-[12px] font-semibold tracking-[0.3em] uppercase`}>
                  Who We Are
                </span>
              </div>
            </StaggerItem>

            {/* Heading */}
            <StaggerItem>
              <h2 className={`${headlineFont.className} text-[#1a1a1a] text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-tight`}>
                Miller & Co Lawyers &{" "}
                <span className="italic text-[#756341]">Migration Agents</span>
              </h2>
            </StaggerItem>

            {/* Body paragraphs */}
            <StaggerItem>
              <p className={`${bodyFont.className} text-[#1a1a1a]/70 text-base leading-relaxed`}>
                Miller & Co Lawyers & Migration Agents is a Sydney-based migration
                law firm dedicated to helping individuals, families, and businesses
                navigate the Australian immigration system with confidence.
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className={`${bodyFont.className} text-[#1a1a1a]/70 text-base leading-relaxed`}>
                The firm is led by Edward Miller, an Australian Migration Lawyer and
                Principal of Miller & Co. Edward has extensive experience assisting
                clients with a wide range of visa and migration matters, focusing on
                clear legal guidance, careful case preparation, and strong
                representation to achieve the best possible outcomes.
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className={`${bodyFont.className} text-[#1a1a1a]/70 text-base leading-relaxed`}>
                At Miller & Co, we understand that migration matters are often
                life-changing decisions that impact careers, families, and futures.
                Every case is handled with professionalism, transparency, and a
                strong commitment to compliance with Australian immigration law.
              </p>
            </StaggerItem>

            {/* Highlights */}
            <StaggerContainer className="flex flex-col gap-3 mt-1" stagger={0.1} delayChildren={0}>
              {highlights.map((item) => (
                <StaggerItem key={item}>
                  <div className={`${bodyFont.className} flex items-start gap-3 text-base text-[#1a1a1a]/70`}>
                    <CheckCircle className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                    {item}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </StaggerContainer>

          {/* Right: Image */}
          <AnimateIn
            direction="left"
            duration={0.8}
            delay={0.15}
            className="relative w-full aspect-4/5 lg:aspect-auto lg:h-145"
          >
            {/* Gold border accent */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-[#c8a96e]/30 z-0" />

            <div ref={imgRef} className="relative w-full h-full overflow-hidden z-10">
              <motion.div
                style={{ y: imgY, position: "absolute", top: -45, bottom: -45, left: 0, right: 0 }}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/3.png"
                  alt="Miller & Co – Sydney Migration Law Firm"
                  fill
                  className="object-cover object-center"
                />
              </motion.div>
              <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a]/25 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <AnimateIn
              direction="up"
              delay={0.45}
              duration={0.65}
              className="absolute -bottom-6 -left-6 z-20 bg-[#1a1a1a] px-6 py-5 shadow-xl"
            >
              <p className={`${bodyFont.className} text-[#c8a96e] text-3xl font-semibold`}>
                10,000+
              </p>
              <p className={`${bodyFont.className} text-white/75 text-xs mt-1 tracking-wide uppercase`}>
                Successful Cases
              </p>
            </AnimateIn>
          </AnimateIn>

        </div>
      </div>
    </section>
  );
}
