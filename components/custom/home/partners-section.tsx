import Image from "next/image";
import { bodyFont, headlineFont } from "@/lib/typographies";

const LOGOS = [
  { src: "/logo-acadmey.jpg",   alt: "Academy" },
  { src: "/logo-acs.jpg",       alt: "ACS" },
  { src: "/logo-amidata.jpg",   alt: "Amidata" },
  { src: "/logo-aramex.jpg",    alt: "Aramex" },
  { src: "/logo-aup.jpg",       alt: "AUP" },
  { src: "/logo-automator.jpg", alt: "Automator" },
  { src: "/logo-betola.jpg",    alt: "Betola" },
  { src: "/logo-dental.jpg",    alt: "Dental" },
  { src: "/logo-deskspace.jpg", alt: "Deskspace" },
  { src: "/logo-ecoline.jpg",   alt: "Ecoline" },
  { src: "/logo-inniti.jpg",    alt: "Inniti" },
  { src: "/logo-jackson.jpg",   alt: "Jackson" },
  { src: "/logo-jennings.jpg",  alt: "Jennings" },
  { src: "/logo-kilcran.jpg",   alt: "Kilcran" },
  { src: "/logo-mas.jpg",       alt: "MAS" },
  { src: "/logo-precision.jpg", alt: "Precision" },
  { src: "/logo-ross.jpg",      alt: "Ross" },
  { src: "/logo-srs.jpg",       alt: "SRS" },
  { src: "/logo-sydesign.jpg",  alt: "Sydesign" },
  { src: "/logo-unknown.jpg",   alt: "Partner" },
  { src: "/logo-workfast.jpg",  alt: "Workfast" },
];

export default function PartnersSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-16 lg:py-20 border-y border-black/6">
      {/* Subtle radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#c8a96e08_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col items-center gap-3 mb-12 px-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#c8a96e]/40" />
          <span
            className={`${bodyFont.className} text-[#1a1a1a]/35 text-[10px] font-semibold tracking-[0.3em] uppercase`}
          >
            Trusted By
          </span>
          <span className="h-px w-8 bg-[#c8a96e]/40" />
        </div>
        <p
          className={`${headlineFont.className} text-[#1a1a1a]/60 text-xl sm:text-2xl font-medium text-center`}
        >
          Businesses &amp; organisations that rely on{" "}
          <span className="italic text-[#c8a96e]/70">Miller &amp; Co.</span>
        </p>
      </div>

      {/* Grid */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border border-black/8 divide-x divide-y divide-black/8">
          {LOGOS.map((logo) => (
            <div
              key={logo.src}
              className="flex items-center justify-center px-6 py-6"
            >
              <div className="relative w-full h-35">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                  sizes="160px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/8 to-transparent" />
    </section>
  );
}
