import { headlineFont, bodyFont } from "@/lib/typographies";
import { Quote } from "lucide-react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

const testimonials = [
  {
    quote:
      "Miller & Co made what felt like an impossible process completely manageable. Their expertise in employer-sponsored visas is unmatched — we had our Sub 482 approved faster than we expected.",
    name: "Ingrid Correa",
    title: "Business Owner, Sydney",
    initials: "IC",
  },
  {
    quote:
      "I was facing a visa refusal and didn't know where to turn. The team at Miller & Co handled my AAT appeal with incredible professionalism. I'm now a permanent resident.",
    name: "Wendy Salinas",
    title: "Registered Nurse, Melbourne",
    initials: "WS",
  },
  {
    quote:
      "From the initial consultation to the final approval, every step was clear and stress-free. I genuinely felt like my case mattered to them — not just another file.",
    name: "Gabriel Shelby",
    title: "Software Engineer, Brisbane",
    initials: "GS",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative w-full bg-[#1a1a1a] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#c8a96e07_0%,_transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">

        {/* Section Header */}
        <StaggerContainer className="flex flex-col items-center gap-4 mb-16" stagger={0.12} delayChildren={0.05}>
          <StaggerItem>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#c8a96e]" />
              <span
                className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
              >
                Client Stories
              </span>
              <span className="h-px w-10 bg-[#c8a96e]" />
            </div>
          </StaggerItem>
          <StaggerItem>
            <h2
              className={`${headlineFont.className} text-white text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-center leading-tight`}
            >
              Testimonials from{" "}
              <span className="italic text-[#c8a96e]">Clients</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p
              className={`${bodyFont.className} text-white/40 text-sm text-center max-w-md leading-relaxed mt-1`}
            >
              An honest look into how we work — straight from the people we&apos;ve helped.
            </p>
          </StaggerItem>
        </StaggerContainer>

        {/* Testimonial Cards */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5"
          stagger={0.14}
          delayChildren={0.05}
        >
          {testimonials.map((t, i) => (
            <StaggerItem
              key={i}
              className="group relative flex flex-col justify-between gap-8 bg-[#1a1a1a] p-8 hover:bg-[#c8a96e]/5 transition-colors duration-300"
            >
              {/* Top gold accent bar */}
              <span className="absolute top-0 left-0 w-full h-0.5 bg-[#c8a96e] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Quote icon */}
              <Quote className="w-7 h-7 text-[#c8a96e] opacity-60 shrink-0" />

              {/* Quote text */}
              <p
                className={`${bodyFont.className} text-white/60 text-sm leading-relaxed flex-1 group-hover:text-white/75 transition-colors duration-300`}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Divider */}
              <span className="h-px w-full bg-white/10" />

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar initials */}
                <div
                  className={`${bodyFont.className} w-10 h-10 rounded-full bg-[#c8a96e]/15 border border-[#c8a96e]/30 flex items-center justify-center text-[#c8a96e] text-xs font-bold tracking-wider shrink-0`}
                >
                  {t.initials}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`${bodyFont.className} text-white text-sm font-semibold`}
                  >
                    {t.name}
                  </span>
                  <span
                    className={`${bodyFont.className} text-white/30 text-[10px] tracking-[0.15em] uppercase`}
                  >
                    {t.title}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom note */}
        <AnimateIn direction="up" delay={0.1}>
          <p
            className={`${bodyFont.className} text-white/20 text-[10px] tracking-[0.2em] uppercase text-center mt-10`}
          >
            Join hundreds of satisfied clients —{" "}
            <a
              href="mailto:info@visa-australia.legal"
              className="text-[#c8a96e]/50 hover:text-[#c8a96e] transition-colors duration-300"
            >
              start your journey today
            </a>
          </p>
        </AnimateIn>

      </div>
    </section>
  );
}
