import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Admin ", href: "/login" },
];

const officeHours = [
  { day: "Monday – Friday", hours: "9:00 am – 6:00 pm" },
  { day: "Saturday", hours: "9:00 am – 12:00 noon" },
  { day: "Sunday", hours: "Closed" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#faf8f5]">
      {/* Main dark footer block */}
      <div className="relative bg-[#111111] overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/4.png"
            alt="Footer background"
            fill
            className="object-cover object-center opacity-15"
          />
          <div className="absolute inset-0 bg-[#111111]/80" />
        </div>

        {/* Subtle gold radial */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#c8a96e06_0%,transparent_60%)] pointer-events-none z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12 border-b border-white/10">

            {/* Col 1 — Brand */}
            <div className="flex flex-col gap-5 lg:col-span-1">
              <Image
                src="/NEW-logo-TM-White1.png"
                alt="Miller & Co"
                width={160}
                height={60}
                className="object-contain object-left"
              />
              <p className={`${bodyFont.className} text-white/40 text-xs leading-relaxed`}>
                Sydney&apos;s trusted migration law firm. Expert, personalised legal guidance for your immigration journey.
              </p>
              {/* Socials */}
              <div className="flex items-center gap-4 mt-1">
                <a
                  href="https://www.facebook.com/EdwardMillerMigration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-[#c8a96e] transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com/millermigration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-[#c8a96e] transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/edward-miller-20120017"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-[#c8a96e] transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2 — Navigation */}
            <div className="flex flex-col gap-5">
              <h4 className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                Navigation
              </h4>
              <ul className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`${bodyFont.className} text-white/50 text-sm hover:text-[#c8a96e] transition-colors duration-300`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Contact Details */}
            <div className="flex flex-col gap-5">
              <h4 className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                Contact Details
              </h4>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-3.5 h-3.5 text-[#c8a96e] shrink-0 mt-0.5" />
                  <span className={`${bodyFont.className} text-white/50 text-sm leading-relaxed`}>
                    Level 22, Westfield Tower Two,<br />
                    101 Grafton Street, Bondi Junction
                  </span>
                </li>
                <li>
                  <a
                    href="tel:+61280956369"
                    className={`${bodyFont.className} flex items-center gap-3 text-white/50 text-sm hover:text-[#c8a96e] transition-colors duration-300`}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                    +61 2 8095 6369
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@visa-australia.legal"
                    className={`${bodyFont.className} flex items-center gap-3 text-white/50 text-sm hover:text-[#c8a96e] transition-colors duration-300`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
                    info@visa-australia.legal
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4 — Office Hours */}
            <div className="flex flex-col gap-5">
              <h4 className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                Office Hours
              </h4>
              <ul className="flex flex-col gap-4">
                {officeHours.map((item) => (
                  <li key={item.day} className="flex flex-col gap-0.5">
                    <span className={`${bodyFont.className} text-white/70 text-sm font-medium`}>
                      {item.day}
                    </span>
                    <span className={`${bodyFont.className} text-white/35 text-xs tracking-wide`}>
                      {item.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
            <p className={`${bodyFont.className} text-white/25 text-[10px] tracking-[0.15em] uppercase`}>
              © {new Date().getFullYear()} Miller &amp; Co Lawyers &amp; Migration Agents. All rights reserved.
            </p>
            <p className={`${bodyFont.className} text-white/15 text-[10px] tracking-[0.1em] uppercase`}>
              ABN — Migration &amp; Legal Services · Sydney, Australia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
