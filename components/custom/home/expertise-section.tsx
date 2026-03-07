import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

export interface ExpertiseItem {
  label: string;
  sub: string | null;
  isWide?: boolean;
}

const FALLBACK_EXPERTISE: ExpertiseItem[] = [
  { label: "Start-Up Business Sponsored Visa", sub: "Sub 482" },
  { label: "Employer Sponsored Visa", sub: "Sub 482" },
  { label: "Employer Sponsored Permanent Visas", sub: "Sub 186" },
  { label: "Training Visa", sub: "Sub 407" },
  { label: "Skilled Visas", sub: "Sub 189, 190, 489, 491" },
  { label: "Investment Visas", sub: "Sub 188, 888" },
  { label: "Partner Visas", sub: "Sub 820/801, 309/100, 300" },
  { label: "National Innovation visa", sub: "Sub 858" },
  { label: "Visa Refusal & AAT Appeal", sub: null },
  { label: "Carer Visas", sub: "Sub 836/116" },
  { label: "Australian Citizenship", sub: null },
  { label: "Legal Advice", sub: null },
  { label: "Employer Recruitment Services", sub: "For Sub 186/482 Visas", isWide: true },
];

export default function ExpertiseSection() {
  const mainItems = FALLBACK_EXPERTISE.filter((i) => !i.isWide);
  const wideItem = FALLBACK_EXPERTISE.find((i) => i.isWide) ?? FALLBACK_EXPERTISE[FALLBACK_EXPERTISE.length - 1];

  return (
    <section className="relative w-full bg-[#1a1a1a] overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#c8a96e08_0%,_transparent_65%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">

        {/* Section Header */}
        <StaggerContainer className="flex flex-col items-center gap-4 mb-16" stagger={0.12} delayChildren={0.05}>
          <StaggerItem>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#c8a96e]" />
              <span
                className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.3em] uppercase`}
              >
                What We Do
              </span>
              <span className="h-px w-10 bg-[#c8a96e]" />
            </div>
          </StaggerItem>
          <StaggerItem>
            <h2
              className={`${headlineFont.className} text-white text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-center leading-tight`}
            >
              Areas of{" "}
              <span className="italic text-[#c8a96e]">Expertise</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p
              className={`${bodyFont.className} text-white text-base text-center max-w-xl leading-relaxed mt-1`}
            >
              We offer comprehensive migration and legal services across a wide
              range of visa categories and immigration pathways.
            </p>
          </StaggerItem>
        </StaggerContainer>

        {/* Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5"
          stagger={0.07}
          delayChildren={0.05}
        >
          {mainItems.map((item) => (
            <StaggerItem
              key={item.label}
              className="group relative flex flex-col justify-between gap-1 bg-[#1a1a1a] px-7 py-6 hover:bg-[#c8a96e]/5 transition-colors duration-300 cursor-default"
            >
              {/* Gold left accent on hover */}
              <span className="absolute left-0 top-0 h-full w-0.5 bg-[#c8a96e] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />

              <p
                className={`${headlineFont.className} text-white text-xs sm:text-xl font-medium leading-snug group-hover:text-[#c8a96e] transition-colors duration-300`}
              >
                {item.label}
              </p>
              {item.sub && (
                <span
                  className={`${bodyFont.className} text-white text-base tracking-[0.2em] uppercase`}
                >
                  {item.sub}
                </span>
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Full-width bottom item */}
        <AnimateIn direction="up" delay={0.1} className="border-x border-b border-white/5 bg-white/5">
          <div
            className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 bg-[#1a1a1a] px-7 py-6 hover:bg-[#c8a96e]/5 transition-colors duration-300 cursor-default border-t border-white/5"
          >
            <span className="absolute left-0 top-0 h-full w-0.5 bg-[#c8a96e] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
            <p
              className={`${headlineFont.className} text-white text-xs sm:text-xl font-medium group-hover:text-[#c8a96e] transition-colors duration-300`}
            >
              {wideItem.label}
            </p>
            {wideItem.sub && (
              <span
                className={`${bodyFont.className} text-white text-[12px] tracking-[0.2em] uppercase sm:ml-2`}
              >
                — {wideItem.sub}
              </span>
            )}
          </div>
        </AnimateIn>

        {/* Bottom note */}
        <AnimateIn direction="up" delay={0.15}>
          <p
            className={`${bodyFont.className} text-white text-xs tracking-[0.2em] uppercase text-center mt-15`}
          >
            Not sure which visa applies to you?{" "}
            <a
              href="/contact"
              className="text-[#c8a96e]/75 hover:text-[#c8a96e] transition-colors duration-300"
            >
              Contact us for a free assessment
            </a>
          </p>
        </AnimateIn>

      </div>
    </section>
  );
}
