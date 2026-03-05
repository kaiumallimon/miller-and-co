"use client";

import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { motion } from "motion/react";
import { usePreloaderReady } from "@/components/PreloaderContext";
import { MapPin } from "lucide-react";
import GradientText from "@/components/GradientText";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

export default function AboutHero() {
  const { ready } = usePreloaderReady();

  return (
    <section className="relative w-full min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
          {/* Mobile image */}
          <Image
            src="/1-mobile.png"
            alt="Miller & Co – About Us"
            fill
            priority
            className="object-cover object-center md:hidden"
          />
          {/* Desktop image */}
          <Image
            src="/1.png"
            alt="Miller & Co – About Us"
            fill
            priority
            className="object-cover object-center hidden md:block"
          />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Gold radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#c8a96e10_0%,transparent_65%)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-[60vh] lg:min-h-[70vh] max-w-7xl mx-auto px-6 lg:px-10 pt-48 pb-20">
        <motion.div
          className="flex flex-col gap-5 max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate={ready ? "visible" : "hidden"}
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants}>
            <GradientText
              colors={["#c8a96e", "#FFFFFF", "#c8a96e"]}
              animationSpeed={8}
              showBorder={false}
              className={`${bodyFont.className} mx-0! justify-start! text-[10px] font-semibold tracking-widest uppercase p-0`}
            >
              Sydney&apos;s Trusted Migration Law Firm
            </GradientText>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className={`${headlineFont.className} text-white text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight`}
          >
            About{" "}
            <span className="italic text-[#c8a96e]">Miller & Co.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className={`${bodyFont.className} text-white/65 text-sm leading-relaxed max-w-xl`}
          >
            A dedicated Sydney migration law firm led by Edward Miller, helping
            individuals, families, and businesses navigate Australia&apos;s
            immigration system with clarity and confidence.
          </motion.p>

          {/* Address strip */}
          <motion.div
            variants={itemVariants}
            className={`${bodyFont.className} flex items-center gap-2 mt-4 pt-8 border-t border-white/20 text-white/50 text-xs`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#c8a96e]" />
            Level 22, Westfield Tower Two, 101 Grafton Street, Bondi Junction
          </motion.div>
        </motion.div>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
          className={`${bodyFont.className} absolute bottom-8 right-6 lg:right-10 text-[#c8a96e] text-[10px] tracking-widest uppercase flex items-center gap-2`}
        >
          <span>Home</span>
          <span className="text-[#c8a96e]">/</span>
          <span className="text-white/60">About Us</span>
        </motion.div>
      </div>
    </section>
  );
}
