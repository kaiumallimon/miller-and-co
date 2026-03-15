"use client";

import { useScroll } from "@/hooks/useScroll";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import Image from "next/image";
import { Phone, Mail, ArrowRight, X, Menu } from "lucide-react";
import { motion } from "motion/react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const topBarVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const headerContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.22 } },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const navContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.38 } },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function CustomHeader() {
  const { isScrolled } = useScroll({ threshold: 80 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMobileMenuOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavigate = (href: string) => {
    router.push(href);
    closeMobileMenu();
  };

  return (
    <>
      {/* Top announcement bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 overflow-hidden ${isScrolled ? "h-0 opacity-0" : "h-9 opacity-100"
          }`}
      >
        <motion.div
          className="bg-primary backdrop-blur-md h-9 flex items-center overflow-hidden"
          variants={topBarVariants}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full flex items-center justify-center md:justify-between overflow-hidden">
            <div className={`${bodyFont.className} flex items-center gap-4 text-white text-xs min-w-0`}>
              <a href="tel:+61280956369" className="flex items-center gap-1.5 hover:text-[#c8a96e] transition-colors duration-300 font-medium whitespace-nowrap">
                <Phone className="w-3 h-3 shrink-0" />
                +61 2 8095 6369
              </a>
              <a href="mailto:info@visa-australia.legal" className="flex items-center gap-1.5 hover:text-[#c8a96e] transition-colors duration-300 font-medium whitespace-nowrap hidden sm:flex truncate">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">info@visa-australia.legal</span>
              </a>
            </div>
            <span className={`${bodyFont.className} hidden md:block text-white text-xs font-medium`}>
              Sydney&apos;s Trusted Migration Law Firm
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main header */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 overflow-x-hidden ${isScrolled ? "top-0" : "top-9"
          } ${isScrolled
            ? "bg-[#0f0f0f]/90 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-white/8"
            : "bg-linear-to-b from-black/50 to-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? "h-20" : "h-28"}`}
            variants={headerContainerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
          >

            {/* Logo */}
            <motion.a
              href="/"
              variants={headerItemVariants}
              className="cursor-pointer relative group shrink-0"
              aria-label="Home"
            >
              <Image
                src="/NEW-logo-TM-White1.png"
                alt="Miller & Co Logo"
                width={220}
                height={80}
                className={`object-contain transition-all duration-300 group-hover:opacity-80 ${isScrolled ? "w-52" : "w-40 md:w-72"
                  }`}
              />
            </motion.a>

            {/* Desktop Nav */}
            <motion.nav
              className="hidden md:flex items-center"
              variants={navContainerVariants}
            >
              {NAV_LINKS.map((link) => (
                <motion.button
                  key={link.href}
                  variants={navItemVariants}
                  onClick={() => handleNavigate(link.href)}
                  className={`${bodyFont.className} relative px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300 group ${isActive(link.href) ? "text-[#c8a96e]" : "text-white/70 hover:text-white"
                    }`}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#c8a96e] rounded-full transition-all duration-300 origin-left ${isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                  />
                </motion.button>
              ))}

              {/* Divider */}
              <motion.span variants={navItemVariants} className="w-px h-5 bg-white/15 mx-4" />

              {/* CTA */}
              <motion.button
                variants={navItemVariants}
                onClick={() => handleNavigate("/contact")}
                className={`${bodyFont.className} group inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-primary/90 hover:gap-3 hover:shadow-lg hover:shadow-primary/25`}
              >
                Book a Consultation
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </motion.button>
            </motion.nav>

            {/* Mobile hamburger */}
            <motion.button
              variants={headerItemVariants}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:text-[#c8a96e] transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Mobile Menu — slide from right */}
      <div
        className={`fixed inset-0 z-100 md:hidden transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMobileMenu} />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-[#0f0f0f] border-l border-white/10 flex flex-col transition-transform duration-500 overflow-hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Image src="/NEW-logo-TM-White1.png" alt="Miller & Co" width={156} height={42} className="object-contain" />
            <button onClick={closeMobileMenu} className="text-white/50 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col flex-1 px-6 py-8 gap-1">
            {NAV_LINKS.map((link, i) => (
              <button
                key={link.href}
                onClick={() => handleNavigate(link.href)}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 60}ms` : "0ms" }}
                className={`${bodyFont.className} flex items-center justify-between px-4 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 rounded-sm group ${isActive(link.href)
                  ? "text-[#c8a96e] bg-[#c8a96e]/8"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                  } ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
              >
                {link.label}
                <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 ${isActive(link.href) ? "text-[#c8a96e]" : "text-white/20"}`} />
              </button>
            ))}
          </nav>

          {/* Bottom contact + CTA */}
          <div className="px-6 pb-8 flex flex-col gap-4 border-t border-white/10 pt-6">
            <button
              onClick={() => handleNavigate("/contact")}
              className={`${bodyFont.className} w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300`}
            >
              Book a Consultation
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className={`${bodyFont.className} flex flex-col gap-2 text-white/40 text-[10px]`}>
              <a href="tel:+61280956369" className="flex items-center gap-2 hover:text-[#c8a96e] transition-colors">
                <Phone className="w-3 h-3" /> +61 2 8095 6369
              </a>
              <a href="mailto:info@visa-australia.legal" className="flex items-center gap-2 hover:text-[#c8a96e] transition-colors">
                <Mail className="w-3 h-3" /> info@visa-australia.legal
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}