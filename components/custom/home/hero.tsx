"use client";

import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeHero() {

  const contactInfo = {
    phone: "+61 2 8095 6369",
    email: "info@visa-australia.legal",
    address: "Level 22, Westfield Tower Two, 101 Grafton Street, Bondi Junction"
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/1.png"
        alt="Miller & Co Hero Image"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-6 lg:px-10 pt-32">
        <div className="max-w-2xl flex flex-col gap-6">

          {/* Eyebrow */}
          <div className="w-fit shimmer-border rounded-full">
            <span
              className={`${bodyFont.className} inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-[#c8a96e] text-[8px] md:text-[10px] font-semibold tracking-[0.25em] uppercase`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8a96e] animate-pulse" />
              Sydney&apos;s Trusted Migration Law Firm
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`${headlineFont.className} text-white text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight`}
          >
            Expert Solutions for Your{" "}
            <span className="italic text-[#c8a96e]">Legal</span> and Migration
            Needs
          </h1>

          {/* Subtext */}
          <p
            className={`${bodyFont.className} text-white/70 text-sm leading-relaxed max-w-lg`}
          >
            Sydney based, top trusted Migration Law firm. We provide expert guidance and solutions for all your immigration needs. Trust our experienced team to navigate complex legal matters and ensure a smooth and successfull migration process.
          </p>

          {/* CTA */}
          <div className="flex flex-col md:flex-row max-w-md md:max-w-2xl items-center gap-4 mt-2">
            <Button
              variant="outline"
              size={"lg"}
              className={`${bodyFont.className} w-full md:w-auto text-xs font-bold tracking-[0.2em] uppercase bg-transparent border-white text-white hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 cursor-pointer rounded-none`}
            >
              See Our Services
            </Button>
            <Button
              variant="outline"
              size={"lg"}
              className={`${bodyFont.className} w-full md:w-auto text-xs font-bold tracking-[0.2em] uppercase bg-[#c8a96e] border-[#c8a96e] hover:border-[#c8a96e]/70 text-[#1a1a1a] hover:bg-[#c8a96e]/70 transition-all duration-300 rounded-none cursor-pointer`}
              onClick={() => window.location.href = `mailto:${contactInfo.email}`}
            >
              Book a Consultation
            </Button>
          </div>

          {/* Contact info strip */}
          <div
            className={`${bodyFont.className} flex flex-row flex-wrap gap-x-8 gap-y-3 mt-6 pt-10 border-t border-white/20 text-white/60 text-xs`}
          >
            <a
              href="tel:+61280956369"
              className="flex items-center gap-2 hover:text-[#c8a96e] transition-colors duration-300"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              +612 8095 6369
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
          </div>
        </div>
      </div>
    </section>
  );
}