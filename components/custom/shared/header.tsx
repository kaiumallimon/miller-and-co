"use client";

import { useScroll } from "@/hooks/useScroll";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function CustomHeader() {
  const { isScrolled } = useScroll({ threshold: 80 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#1a1a1a]/75 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Image
              src="/NEW-logo-TM-White1.png"
              alt="Miller & Co Logo"
              width={150}
              height={40}
              className="object-contain"
            />

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  className={`${bodyFont.className} relative px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${
                    isActive(link.href)
                      ? "text-[#c8a96e]"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#c8a96e] rounded-full" />
                  )}
                </button>
              ))}

              {/* CTA */}
              <button
                onClick={() => handleNavigate("/contact")}
                className={`${bodyFont.className} ml-4 px-6 py-2.5 bg-primary hover:bg-primary/85 text-white text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 rounded-sm shadow-lg hover:shadow-primary/30 hover:shadow-xl`}
              >
                Book a Consultation
              </button>
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 group"
            >
              <span
                className={`block h-[2px] w-6 bg-white transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 bg-white transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#111111] flex flex-col transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col justify-center items-center flex-1 gap-8 px-8">
          {/* Logo in mobile menu */}
          <div className="flex flex-col items-center gap-1 mb-4">
            <span className={`${headlineFont.className} text-white text-3xl font-semibold tracking-wide`}>
              Miller &amp; Co
            </span>
            <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] tracking-[0.3em] uppercase`}>
              Lawyers &amp; Migration Agents
            </span>
          </div>

          <div className="w-16 h-[1px] bg-[#c8a96e]/40" />

          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavigate(link.href)}
              className={`${bodyFont.className} text-base font-semibold tracking-[0.2em] uppercase transition-colors duration-300 ${
                isActive(link.href) ? "text-[#c8a96e]" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="w-16 h-[1px] bg-[#c8a96e]/40" />

          <button
            onClick={() => handleNavigate("/contact")}
            className={`${bodyFont.className} px-10 py-3.5 bg-primary hover:bg-primary/85 text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 rounded-sm`}
          >
            Book a Consultation
          </button>
        </div>
      </div>
    </>
  );
}