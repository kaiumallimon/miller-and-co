import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { GraduationCap, Scale, BadgeCheck, Building2 } from "lucide-react";

const CREDENTIALS = [
  {
    icon: Scale,
    label: "Australian Migration Lawyer",
    sub: "Principal of Miller & Co. Lawyers & Migration Agents",
  },
  {
    icon: BadgeCheck,
    label: "Registration No. LPN: 5511850",
    sub: "NSW Registered Migration Lawyer",
  },
  {
    icon: GraduationCap,
    label: "Bachelor of Laws",
    sub: "University of Sydney",
  },
  {
    icon: Building2,
    label: "Graduate Diploma of Legal Practice",
    sub: "The College of Law",
  },
];

export default function PrincipalSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0f0f0f]">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/6">

          {/* ── Left — photo ───────────────────────────────────────────── */}
          <AnimateIn direction="right" delay={0.05} duration={0.8}>
            <div className="relative h-120 lg:h-full min-h-130 overflow-hidden bg-[#141414]">
              <Image
                src="/Pic.png"
                alt="Edward Miller — Principal Migration Lawyer"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Bottom fade into card bg */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#141414] to-transparent" />

              {/* Floating name badge */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="inline-flex flex-col gap-1">
                  <span
                    className={`${headlineFont.className} text-[#faf8f5] text-3xl font-semibold leading-tight`}
                  >
                    Edward Miller
                  </span>
                  <span
                    className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.25em] uppercase`}
                  >
                    NSW Registered Migration Lawyer
                  </span>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* ── Right — details ────────────────────────────────────────── */}
          <div className="flex flex-col justify-center gap-10 px-10 py-12 lg:py-16 bg-[#141414] border-t lg:border-t-0 lg:border-l border-white/6">

            {/* Eyebrow */}
            <StaggerContainer className="flex flex-col gap-5" stagger={0.1} delayChildren={0.1}>
              <StaggerItem>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[#c8a96e]" />
                  <span
                    className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.3em] uppercase`}
                  >
                    Meet the Principal
                  </span>
                </div>
              </StaggerItem>

              <StaggerItem>
                <h2
                  className={`${headlineFont.className} text-[#faf8f5] text-4xl sm:text-5xl font-semibold leading-tight`}
                >
                  Edward{" "}
                  <span className="italic text-[#c8a96e]">Miller</span>
                </h2>
              </StaggerItem>

              <StaggerItem>
                <p
                  className={`${bodyFont.className} text-white text-base leading-relaxed`}
                >
                  Edward is the principal of Miller &amp; Co., a specialist
                  migration law firm advising individuals, families, and
                  businesses on all aspects of Australian immigration law. With
                  formal legal training and dual admission, Edward brings the
                  rigour of a practising lawyer to every client matter.
                </p>
              </StaggerItem>
            </StaggerContainer>

            {/* Credentials */}
            <StaggerContainer className="flex flex-col gap-px bg-white/5 border border-white/5" stagger={0.08} delayChildren={0.2}>
              {CREDENTIALS.map((item) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.label}>
                    <div className="group flex items-start gap-4 bg-[#141414] px-6 py-5 hover:bg-[#c8a96e]/5 transition-colors duration-300 relative">
                      {/* Left accent */}
                      <span className="absolute left-0 top-0 h-full w-0.5 bg-[#c8a96e] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />

                      <div className="w-8 h-8 bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-[#c8a96e]" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p
                          className={`${headlineFont.className} text-[#faf8f5] text-lg font-medium group-hover:text-[#c8a96e] transition-colors duration-300`}
                        >
                          {item.label}
                        </p>
                        <span
                          className={`${bodyFont.className} text-white/50 text-sm tracking-wide`}
                        >
                          {item.sub}
                        </span>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            {/* Quote */}
            <AnimateIn direction="up" delay={0.3}>
              <blockquote className="border-l-2 border-[#c8a96e]/40 pl-5">
                <p
                  className={`${headlineFont.className} text-white font-semibold text-lg italic leading-relaxed`}
                >
                  &ldquo;Every visa application tells a human story. Our job is
                  to tell it as compellingly as possible.&rdquo;
                </p>
                <footer
                  className={`${bodyFont.className} text-[#c8a96e] text-[10px] tracking-[0.2em] uppercase mt-3`}
                >
                  — Edward Miller
                </footer>
              </blockquote>
            </AnimateIn>
          </div>

        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
}
