"use client";

import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import GradientText from "@/components/GradientText";
import { motion, useScroll, useTransform } from "motion/react";
import { usePreloaderReady } from "@/components/PreloaderContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
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

export default function HomeHero() {
  const { ready } = usePreloaderReady();

  // Page-level parallax: bg image drifts up as user scrolls away from hero
  const { scrollY } = useScroll();
  const bgParallaxY = useTransform(scrollY, [0, 700], [0, 180]);

  const contactInfo = {
    phone: "+61 2 8095 6369",
    email: "info@visa-australia.legal",
    address: "Level 22, Westfield Tower Two, 101 Grafton Street, Bondi Junction"
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ y: bgParallaxY }}
      >
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 1.8, ease: EASE }}
        >
          {/* Mobile image */}
          <Image
            src="/1-mobile.png"
            alt="Miller & Co Hero Image"
            fill
            priority
            className="object-cover object-center md:hidden"
          />
          {/* Desktop image */}
          <Image
            src="/1.png"
            alt="Miller & Co Hero Image"
            fill
            priority
            className="object-cover object-center hidden md:block"
          />
        </motion.div>
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-6 lg:px-10 pt-52 md:pt-44">
        <motion.div
          className="max-w-2xl flex flex-col gap-6"
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
            Expert Solutions for Your{" "}
            <span className="italic text-[#c8a96e]">Legal</span> and Migration
            Needs
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className={`${bodyFont.className} text-white text-base leading-relaxed max-w-lg`}
          >
            Sydney based, top trusted Migration Law firm. We provide expert guidance and solutions for all your immigration needs. Trust our experienced team to navigate complex legal matters and ensure a smooth and successfull migration process.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row max-w-md md:max-w-2xl items-center gap-4 mt-2"
          >
            <Button
              variant="outline"
              size={"lg"}
              className={`${bodyFont.className} w-full md:w-auto text-xs font-bold tracking-[0.2em] uppercase bg-transparent border-white text-white hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 cursor-pointer rounded-none`}
            >
              See Our Services
            </Button>
            <a
              href="/contact"
              className={`${bodyFont.className} py-3 px-6 w-full md:w-auto text-xs font-bold tracking-[0.2em] uppercase bg-[#c8a96e] border-[#c8a96e] hover:border-[#c8a96e]/70 text-[#1a1a1a] hover:bg-[#c8a96e]/70 transition-all duration-300 rounded-none cursor-pointer`}
              onClick={() => window.location.href = `mailto:${contactInfo.email}`}
            >
              Book a Consultation
            </a>
          </motion.div>

          {/* Contact info strip */}
          <motion.div
            variants={itemVariants}
            className={`${bodyFont.className} flex flex-row flex-wrap gap-x-8 gap-y-3 mt-6 pt-10 border-t border-white/20 text-white text-xs`}
          >
            <a
              href="tel:+61280956369"
              className="flex items-center gap-2 hover:text-[#c8a96e] transition-colors duration-300"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              +61 2 8095 6369
            </a>
            <a
              href="mailto:info@visa-australia.legal"
              className="flex items-center gap-2 hover:text-[#c8a96e] transition-colors duration-300"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              info@visa-australia.legal
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Level 22, Westfield Tower Two, 101 Grafton Street, Bondi Junction
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}