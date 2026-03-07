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

const ROW1 = LOGOS.slice(0, 11);
const ROW2 = LOGOS.slice(11);

function MarqueeRow({
  logos,
  reverse = false,
}: {
  logos: typeof LOGOS;
  reverse?: boolean;
}) {
  const doubled = [...logos, ...logos];
  return (
    <div className="overflow-hidden">
      <div
        className="flex items-center"
        style={{
          animation: `${reverse ? "marquee-reverse" : "marquee"} 28s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={`${logo.src}-${i}`}
            className="shrink-0 relative mx-8 w-40 h-[140px]"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              className="object-contain"
              sizes="160px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnersSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden py-16 lg:py-20 border-y border-black/6">
      {/* Subtle radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#c8a96e08_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col items-center gap-3 mb-12 px-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#756341]" />
          <span
            className={`${bodyFont.className} text-[#756341] text-[12px] font-semibold tracking-[0.3em] uppercase`}
          >
            Trusted By
          </span>
          <span className="h-px w-8 bg-[#756341]" />
        </div>
        <p
          className={`${headlineFont.className} text-black text-xl sm:text-2xl font-medium text-center`}
        >
          Businesses &amp; organisations that rely on{" "}
          <span className="italic text-[#756341]">Miller &amp; Co.</span>
        </p>
      </div>

      {/* Marquee rows */}
      <div className="relative flex flex-col gap-2">
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <MarqueeRow logos={ROW1} />
        <MarqueeRow logos={ROW2} reverse />
      </div>

      {/* Bottom divider line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-black/8 to-transparent" />
    </section>
  );
}
