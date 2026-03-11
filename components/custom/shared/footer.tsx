"use client";

import Image from "next/image";
import Link from "next/link";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { useParallax } from "@/hooks/useParallax";
import { motion } from "motion/react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  { label: "Admin Portal", href: "/admin" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const officeHours = [
  { day: "Monday – Friday", hours: "9:00 am – 6:00 pm" },
  { day: "Saturday", hours: "9:00 am – 12:00 noon" },
  { day: "Sunday", hours: "9:00 am to 12:00 noon" },
];

export default function Footer() {
  const { ref: footerImgRef, y: footerImgY } = useParallax(40);
  return (
    <footer className="relative w-full">
      {/* Main dark footer block */}
      <div className="relative bg-[#111111] overflow-hidden">
        {/* Background image with overlay */}
        <div ref={footerImgRef} className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            style={{ y: footerImgY, position: "absolute", top: -40, bottom: -40, left: 0, right: 0 }}
          >
            <Image
              src="/5.png"
              alt="Footer background"
              fill
              className="object-cover object-center opacity-10"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[#111111]/30" />
        </div>

        {/* Subtle gold radial */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#c8a96e07_0%,transparent_60%)] pointer-events-none z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/8"
            stagger={0.1}
            delayChildren={0.05}
          >
            {/* Col 1 — Brand (spans 3) */}
            <StaggerItem className="lg:col-span-3 flex flex-col gap-5">
              <Image
                src="/NEW-logo-TM-White1.png"
                alt="Miller & Co"
                width={150}
                height={55}
                className="object-contain object-left"
              />
              <p className={`${bodyFont.className} text-white/90 text-sm leading-relaxed`}>
                Sydney&apos;s trusted migration law firm. Expert, personalised legal guidance for every immigration journey.
              </p>
              {/* Socials — original brand colors */}
              <div className="flex items-center gap-3 mt-1">
                <a
                  href="https://www.facebook.com/australia.visa.lawyer"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-[#1877F2]/25 border border-white/8 hover:border-[#1877F2] transition-all duration-300"
                >
                  <FaFacebook className="w-5 h-5 text-white/40 hover:text-[#1877F2]" style={{ color: '#1877F2' }} />
                </a>
                <a
                  href="https://twitter.com/millermigration"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/25 border border-white/8 hover:border-white transition-all duration-300"
                >
                  <FaXTwitter className="w-5 h-5" style={{ color: '#e7e7e7' }} />
                </a>
                <a
                  href="https://www.linkedin.com/in/edward-miller-20120017"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-[#0A66C2]/25 border border-white/8 hover:border-[#0A66C2] transition-all duration-300"
                >
                  <FaLinkedin className="w-5 h-5" style={{ color: '#0A66C2' }} />
                </a>
              </div>

              {/* Registration note */}
              <div className={`${bodyFont.className} flex flex-col gap-1 pt-2 border-t border-white/6`}>
                <span className="text-[#c8a96e] text-[11px] tracking-[0.25em] uppercase font-semibold">Registered Migration Lawyer</span>
                <span className="text-white/90 text-[12px]">LPN: 5511850</span>
              </div>
            </StaggerItem>

            {/* Col 2 — Navigation (spans 2) */}
            <StaggerItem className="lg:col-span-2 flex flex-col gap-5">
              <h4 className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.3em] uppercase`}>
                Navigation
              </h4>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`${bodyFont.className} text-white/90 text-sm hover:text-[#c8a96e] transition-colors duration-300`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* Col 3 — Legal (spans 2) */}
            <StaggerItem className="lg:col-span-2 flex flex-col gap-5">
              <h4 className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.3em] uppercase`}>
                Legal
              </h4>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`${bodyFont.className} text-white/90 text-sm hover:text-[#c8a96e] transition-colors duration-300`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </StaggerItem>

            {/* Col 4 — Contact (spans 3) */}
            <StaggerItem className="lg:col-span-3 flex flex-col gap-5">
              <h4 className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.3em] uppercase`}>
                Contact
              </h4>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-3.5 h-3.5 text-[#c8a96e] shrink-0 mt-0.5" />
                  <span className={`${bodyFont.className} text-white/90 text-sm leading-relaxed`}>
                    Level 22, Westfield Tower Two,<br />
                    101 Grafton Street, Bondi Junction
                  </span>
                </li>
                <li>
                  <a
                    href="tel:+61280956369"
                    className={`${bodyFont.className} flex items-center gap-3 text-white/90 text-sm hover:text-[#c8a96e] transition-colors duration-300`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                    +61 2 8095 6369
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@visa-australia.legal"
                    className={`${bodyFont.className} flex items-center gap-3 text-white/90 text-sm hover:text-[#c8a96e] transition-colors duration-300`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                    info@visa-australia.legal
                  </a>
                </li>
              </ul>
            </StaggerItem>

            {/* Col 5 — Office Hours (spans 2) */}
            <StaggerItem className="lg:col-span-2 flex flex-col gap-5">
              <h4 className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.3em] uppercase flex items-center gap-2`}>
                Office Hours
              </h4>
              <ul className="flex flex-col gap-4">
                {officeHours.map((item) => (
                  <li key={item.day} className="flex flex-col gap-0.5">
                    <span className={`${bodyFont.className} text-white/90 text-sm font-medium`}>
                      {item.day}
                    </span>
                    <span className={`${bodyFont.className} text-white/90 text-xs`}>
                      {item.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </StaggerItem>

          </StaggerContainer>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          >
            <p className={`${bodyFont.className} text-white/80 text-[10px] tracking-[0.15em] uppercase`}>
              © {new Date().getFullYear()} Miller &amp; Co Lawyers &amp; Migration Agents Pty Ltd. All rights reserved.
            </p>
            <p className={`${bodyFont.className} text-white/80 text-[10px] tracking-widest uppercase`}>
              Migration &amp; Legal Services · Sydney, Australia
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
