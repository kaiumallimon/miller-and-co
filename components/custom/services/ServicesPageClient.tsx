"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  Heart,
  Award,
  Shield,
  Scale,
  Phone,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Star,
  Clock,
  FileText,
  Home,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICE_CATEGORIES = [
  {
    id: "employer-sponsored",
    icon: Briefcase,
    label: "Employer Sponsored Visas",
    tagline: "Bringing skilled talent to Australian businesses",
    description:
      "We specialise in the full suite of employer-sponsored visa pathways — from temporary skilled workers to permanent residence. Our team manages complex sponsorship obligations, labour market testing, and nomination requirements so your business remains compliant.",
    services: [
      {
        label: "Employer Sponsored Visa",
        sub: "Subclass 482",
        detail:
          "Skills in Demand (SID) visa allows employers to address labour shortages by sponsoring skilled overseas workers. We handle Standard and Labour Agreement streams.",
      },
      {
        label: "Employer Sponsored Permanent Visa",
        sub: "Subclass 186 (TRT, DE)",
        detail:
          "Employer Nomination Scheme (ENS) visa for skilled workers to live and work in Australia permanently. Available via the Direct Entry, Temporary Residence Transition, and Labour Agreement streams.",
      },
      {
        label: "Start-Up Business Sponsored Visa",
        sub: "Subclass 482",
        detail:
          "Tailored sponsorship strategies for emerging businesses and start-ups seeking to attract niche international talent under the SID visa.",
      },
      {
        label: "Training Visa",
        sub: "Subclass 407",
        detail:
          "For occupational training to improve skills in a nominee's current occupation, or full time work-based training.",
      },
    ],
    highlights: [
      "Standard Business Sponsorship (SBS) applications",
      "Labour Market Testing compliance",
      "Sponsorship obligation advice",
      "Skills assessment coordination",
    ],
  },
  {
    id: "skilled-migration",
    icon: Award,
    label: "Skilled Migration",
    tagline: "Merit-based pathways to Australian permanent residence",
    description:
      "Australia's points-tested skilled migration program offers multiple independent and state-nominated pathways. We assess your profile, maximise your points score, and manage your Expression of Interest through to grant.",
    services: [
      {
        label: "Skilled Independent Visa",
        sub: "Subclass 189",
        detail:
          "Points-tested permanent residence visa for skilled workers not sponsored by an employer or state. Requires an invitation through SkillSelect.",
      },
      {
        label: "Skilled Nominated Visa",
        sub: "Subclass 190",
        detail:
          "Permanent residence visa for skilled workers nominated by a state or territory government — attracting an additional 5 points toward the threshold.",
      },
      {
        label: "Skilled Work Regional Visa",
        sub: "Subclass 491",
        detail:
          "Five-year provisional visa for skilled workers nominated by a state or sponsored by an eligible relative in a designated regional area of Australia.",
      },
      {
        label: "Skilled Regional Resident Visa (Legacy Pathway)",
        sub: "Subclass 489 (legacy only — closed to new applicants)",
        detail:
          "Legacy pathway for existing Subclass 489 holders only. This pathway is not open to new primary applications and is included for current 489 visa holders seeking transition guidance.",
      },
    ],
    highlights: [
      "SkillSelect profile optimisation",
      "Points score assessment & maximisation",
      "State nomination strategy",
      "Skills & English assessment preparation",
    ],
  },
  {
    id: "business-investment",
    icon: TrendingUp,
    label: "Business & Investment Visas",
    tagline: "Pathways for entrepreneurs and high-net-worth investors",
    description:
      "Australia actively courts business innovators and high-net-worth investors. We guide clients through the Business Innovation and Investment Program — from initial Expression of Interest to the permanent residence stage.",
    services: [
      {
        label: "Business Innovation & Investment (Provisional)",
        sub: "Subclass 188",
        detail:
          "Provisional visa for businesspeople, investors, and entrepreneurs. Streams include Business Innovation, Investor, Significant Investor, Premium Investor, and Entrepreneur.",
      },
      {
        label: "Business Innovation & Investment (Permanent)",
        sub: "Subclass 888",
        detail:
          "Permanent residence visa for Subclass 188 holders who have fulfilled their provisional visa conditions and demonstrated a commitment to business or investment activity in Australia.",
      },
    ],
    highlights: [
      "BIIP stream selection advice",
      "Business activity plan preparation",
      "Complying investment guidance",
      "State government nomination",
    ],
  },
  {
    id: "family-visas",
    icon: Heart,
    label: "Family & Partner Visas",
    tagline: "Reuniting families across borders",
    description:
      "Family is the foundation of our practice. We handle the full spectrum of partner and family visas — onshore and offshore — with the sensitivity and expertise that these deeply personal applications deserve.",
    services: [
      {
        label: "Partner Visa (Onshore)",
        sub: "Subclass 820 / 801",
        detail:
          "Two-stage visa for partners of Australian citizens, permanent residents, or eligible New Zealand citizens applying while in Australia. Stage 1 (820) is temporary; Stage 2 (801) is permanent.",
      },
      {
        label: "Partner Visa (Offshore)",
        sub: "Subclass 309 / 100",
        detail:
          "Two-stage visa for partners applying from outside Australia. Subclass 309 is the provisional visa; Subclass 100 is granted after fulfilling relationship requirements.",
      },
      {
        label: "Prospective Marriage Visa",
        sub: "Subclass 300",
        detail:
          "Allows a fiancé(e) of an Australian citizen, permanent resident, or eligible New Zealand citizen to travel to Australia to marry their prospective spouse.",
      },
      {
        label: "Carer Visa",
        sub: "Subclass 836 / 116",
        detail:
          "For people who wish to travel to, or remain in, Australia to provide ongoing care to an Australian citizen or permanent resident with a medical condition.",
      },
    ],
    highlights: [
      "Relationship evidence strategy",
      "Onshore & offshore applications",
      "Bridging visa advice",
      "ART support for refused applications",
    ],
  },
  {
    id: "national-innovation-visa",
    icon: Star,
    label: "National Innovation Visa",
    tagline: "Subclass 858 for exceptional global talent",
    description:
      "Focused guidance for high-achieving individuals pursuing the National Innovation Visa (Subclass 858), with a strategy tailored to evidentiary thresholds and nomination requirements.",
    services: [
      {
        label: "National Innovation Visa",
        sub: "Subclass 858",
        detail:
          "Permanent residence pathway for individuals with exceptional achievement in target sectors including AgriFood, CleanTech, CyberSecurity, FinTech, MedTech, Infrastructure, and Space & Advanced Manufacturing.",
      },
    ],
    highlights: [
      "Sector-specific endorser identification",
      "Exceptional achievement portfolio preparation",
      "Evidence and narrative strategy",
      "Nomination and lodgement support",
    ],
  },
  {
    id: "australian-citizenship",
    icon: Users,
    label: "Australian Citizenship",
    tagline: "Clear guidance from eligibility to ceremony",
    description:
      "Dedicated citizenship support for eligible permanent residents, including eligibility analysis, residence calculations, documentation checks, and preparation for each stage of the process.",
    services: [
      {
        label: "Australian Citizenship",
        sub: "By conferral",
        detail:
          "Assistance with citizenship applications including eligibility assessment, residence calculations, character and identity documentation, and citizenship test preparation.",
      },
    ],
    highlights: [
      "Citizenship eligibility assessments",
      "Residence and absences calculation",
      "Application and document preparation",
      "Naturalisation ceremony guidance",
    ],
  },
  {
    id: "legal-advisory",
    icon: Scale,
    label: "Reviews / Refusals / ART Matters",
    tagline: "Strategic representation when decisions go wrong",
    description:
      "When a visa is refused or cancelled, the consequences can be life-changing. Our Australian legal practitioners holding current practising certificates in NSW specializing in Migration Law provide robust representation before the Administrative Review Tribunal (ART) and strategic legal advice on complex immigration matters.",
    services: [
      {
        label: "Visa Refusal & ART Appeal",
        sub: null,
        detail:
          "Merits review of refusals and cancellations before the Administrative Review Tribunal. We analyse the delegate's decision, prepare written submissions, and represent clients at hearings.",
      },
      {
        label: "Migration Legal Advice",
        sub: null,
        detail:
          "Fixed-fee legal consultations covering visa options, compliance obligations, sponsorship duties, character issues, and complex immigration scenarios.",
      },
    ],
    highlights: [
      "ART submissions and hearing representation",
      "Ministerial intervention requests",
      "Compliance audits for sponsors",
      "Second opinion legal reviews",
    ],
  },

];

const PROCESS_STEPS = [
  {
    step: "01",
    icon: FileText,
    title: "Free Assessment",
    description:
      "We begin with a complimentary review of your enquiry — assessing your background, goals, and eligibility across relevant visa pathways before recommending next steps.",
  },
  {
    step: "02",
    icon: Scale,
    title: "Strategy Session",
    description:
      "Our migration lawyers present a clear, tailored strategy in a structured 30-minute consultation (AUD $220, in-person or via Zoom) — with honest advice on your best options, timelines, and what to expect.",
  },
  {
    step: "03",
    icon: Shield,
    title: "Application Preparation",
    description:
      "We handle all documentation, forms, and supporting evidence — ensuring your application is thorough, accurate, and compelling.",
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "Lodgement & Follow-Up",
    description:
      "We lodge your application and manage all correspondence with the Department of Home Affairs through to a decision.",
  }
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ServiceCard({
  service,
}: {
  service: {
    label: string;
    sub: string | null;
    detail: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#0f0f0f] border border-white/6 hover:border-[#c8a96e]/20 transition-colors duration-300">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer group"
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <p
            className={`${headlineFont.className} text-[#faf8f5] text-lg font-medium group-hover:text-[#c8a96e] transition-colors duration-300 truncate`}
          >
            {service.label}
          </p>
          {service.sub && (
            <span
              className={`${bodyFont.className} text-white/80 text-[10px] tracking-[0.2em] uppercase`}
            >
              {service.sub}
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-[#c8a96e] shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-white/20 shrink-0 group-hover:text-[#c8a96e] transition-colors" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-4 border-t border-white/5">
          <p
            className={`${bodyFont.className} text-white/90 text-base leading-relaxed pt-3`}
          >
            {service.detail}
          </p>
        </div>
      )}
    </div>
  );
}

function CategorySection({
  category,
  reverse,
}: {
  category: (typeof SERVICE_CATEGORIES)[number];
  reverse?: boolean;
}) {
  const Icon = category.icon;

  return (
    <AnimateIn direction="up" delay={0.05}>
      <div
        id={category.id}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start py-16 lg:py-20 border-b border-white/6 ${
          reverse ? "lg:[direction:rtl]" : ""
        }`}
      >
        {/* Left — info */}
        <div className={`flex flex-col gap-7 ${reverse ? "lg:[direction:ltr]" : ""}`}>
          {/* Icon + eyebrow */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[#c8a96e]" />
            </div>
            <span
              className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.15em] uppercase`}
            >
              {category.tagline}
            </span>
          </div>

          {/* Heading */}
          <h2
            className={`${headlineFont.className} text-[#faf8f5] text-3xl sm:text-4xl lg:text-[2.5rem] font-semibold leading-tight`}
          >
            {category.label}
          </h2>

          {/* Description */}
          <p
            className={`${bodyFont.className} text-white/90 text-base leading-relaxed`}
          >
            {category.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-col gap-2.5">
            {category.highlights.map((h) => (
              <div key={h} className="flex items-start gap-3">
                <CheckCircle className="w-3.5 h-3.5 text-[#c8a96e] shrink-0 mt-0.5" />
                <span
                  className={`${bodyFont.className} text-white text-base`}
                >
                  {h}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-1">
            <a
              href="/contact"
              className={`${bodyFont.className} inline-flex items-center text-xs font-bold tracking-[0.18em] uppercase bg-transparent border border-[#c8a96e]/40 text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0f0f0f] hover:border-[#c8a96e] transition-all duration-300 rounded-none cursor-pointer px-5 py-2`}
            >
              Enquire About This Service
              <ArrowRight className="w-3 h-3 ml-1.5" />
            </a>
          </div>
        </div>

        {/* Right — service cards */}
        <div className={`flex flex-col gap-2 ${reverse ? "lg:[direction:ltr]" : ""}`}>
          {/* Decorative top line */}
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px flex-1 bg-white/6" />
            <span
              className={`${bodyFont.className} text-white text-[11px] tracking-[0.2em] uppercase`}
            >
              Visa Pathways
            </span>
            <span className="h-px flex-1 bg-white/6" />
          </div>

          {category.services.map((svc) => (
            <ServiceCard key={svc.label} service={svc} />
          ))}
        </div>
      </div>
    </AnimateIn>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ServicesPageClient() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden pt-40 pb-20 lg:pt-52 lg:pb-28">
        {/* Background image — same as home hero */}
        <div className="absolute inset-0">
          <Image
            src="/1-mobile.png"
            alt=""
            fill
            priority
            className="object-cover object-center md:hidden"
          />
          <Image
            src="/1.png"
            alt=""
            fill
            priority
            className="object-cover object-center hidden md:block"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Gold radial accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#c8a96e08_0%,transparent_65%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <StaggerContainer
            className="flex flex-col items-center gap-6 text-center"
            stagger={0.12}
            delayChildren={0.1}
          >
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c8a96e]" />
                <span
                  className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
                >
                  Miller &amp; Co.
                </span>
                <span className="h-px w-10 bg-[#c8a96e]" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1
                className={`${headlineFont.className} text-[#faf8f5] text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight max-w-3xl`}
              >
                Our{" "}
                <span className="italic text-[#c8a96e]">Services</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p
                className={`${bodyFont.className} text-white text-base leading-relaxed max-w-xl`}
              >
                Comprehensive migration law services for individuals,
                families, and businesses — from initial assessment to visa
                grant and beyond.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-2 w-full max-w-md md:max-w-none mx-auto">
                <a
                  href="/contact"
                  className={`${bodyFont.className} flex w-full justify-center md:w-auto px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase bg-[#c8a96e] text-[#0f0f0f] border border-[#c8a96e] hover:bg-transparent hover:text-[#c8a96e] transition-all duration-300 rounded-none cursor-pointer`}
                >
                  Book a Consultation
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
                <a
                  href="tel:+61280956369"
                  className={`${bodyFont.className} flex py-3 px-6 border w-full justify-center md:w-auto text-xs font-bold tracking-[0.2em] uppercase bg-transparent border-white text-white hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 cursor-pointer rounded-none `}
                  onClick={() => (window.location.href = "tel:+61280956369")}
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  +61 2 8095 6369
                </a>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Scroll-down hint */}
          <AnimateIn direction="up" delay={0.6} duration={0.7} className="flex justify-center mt-14">
            <div className="flex flex-col items-center gap-2 opacity-70">
              <span
                className={`${bodyFont.className} text-white text-[12px] tracking-[0.3em] uppercase`}
              >
                Explore Services
              </span>
              <span className="w-px h-8 bg-linear-to-b from-white to-transparent" />
            </div>
          </AnimateIn>
        </div>

        {/* Breadcrumb */}
        <AnimateIn direction="left" delay={0.5} duration={0.6} className="absolute bottom-8 right-6 lg:right-10">
          <div
            className={`${bodyFont.className} text-[#c8a96e] text-[12px] tracking-widest uppercase flex items-center gap-2`}
          >
            <a href="/">Home</a>
            <span className="text-[#c8a96e]">/</span>
            <span className="text-white">Services</span>
          </div>
        </AnimateIn>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />
      </section>

      {/* ── Marquee strip ─────────────────────────────────────────────────── */}
      <section className="bg-[#0d0d0d] border-b border-white/6 sticky top-0 z-30 overflow-hidden">
        <style>{`
          @keyframes services-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .services-marquee-track {
            animation: services-marquee 28s linear infinite;
          }
          .services-marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-linear-to-r from-[#0d0d0d] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-linear-to-l from-[#0d0d0d] to-transparent z-10" />

        <div className="services-marquee-track flex w-max items-center">
          {/* Render 4× for a seamless loop; translateX(-50%) shifts by one full copy */}
          {[...Array(4)].flatMap((_, rep) =>
            SERVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={`${rep}-${cat.id}`}
                  href={`#${cat.id}`}
                  className={`${bodyFont.className} group flex items-center gap-2 px-6 py-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-white hover:text-[#c8a96e] transition-colors duration-200 whitespace-nowrap border-r border-white/5`}
                >
                  <Icon className="w-3 h-3 shrink-0 group-hover:text-[#c8a96e] transition-colors" />
                  {cat.label}
                </a>
              );
            })
          )}
        </div>
      </section>

      {/* ── Service categories ────────────────────────────────────────────── */}
      <section className="bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {SERVICE_CATEGORIES.map((cat, i) => (
            <CategorySection key={cat.id} category={cat} reverse={i % 2 !== 0} />
          ))}
        </div>
      </section>

      {/* ── Our Process ───────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#1a1a1a] overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#c8a96e07_0%,transparent_60%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          {/* Header */}
          <StaggerContainer
            className="flex flex-col items-center gap-4 mb-16 text-center"
            stagger={0.12}
            delayChildren={0.05}
          >
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c8a96e]" />
                <span
                  className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
                >
                  How We Work
                </span>
                <span className="h-px w-10 bg-[#c8a96e]" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <h2
                className={`${headlineFont.className} text-white text-4xl sm:text-5xl font-semibold leading-tight`}
              >
                A Simple,{" "}
                <span className="italic text-[#c8a96e]">Proven</span> Process
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p
                className={`${bodyFont.className} text-white text-base leading-relaxed max-w-lg mt-1`}
              >
                Every client journey is different — but our commitment to
                clarity, transparency, and results is constant.
              </p>
            </StaggerItem>
          </StaggerContainer>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimateIn key={step.step} direction="up" delay={i * 0.1}>
                  <div className="group relative flex flex-col gap-5 bg-[#1a1a1a] p-7 hover:bg-[#c8a96e]/5 transition-colors duration-300 h-full">
                    {/* Hover left accent */}
                    <span className="absolute left-0 top-0 h-full w-0.5 bg-[#c8a96e] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />

                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#c8a96e]" />
                      </div>
                      <span
                        className={`${bodyFont.className} text-white/20 text-4xl font-semibold leading-none`}
                      >
                        {step.step}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3
                        className={`${headlineFont.className} text-white text-xl font-semibold group-hover:text-[#c8a96e] transition-colors duration-300`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`${bodyFont.className} text-white text-base leading-relaxed`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#faf8f5] overflow-hidden py-24 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#c8a96e10_0%,transparent_60%)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left */}
            <StaggerContainer className="flex flex-col gap-7" stagger={0.12} delayChildren={0.05}>
              <StaggerItem>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-[#c8a96e]" />
                  <span
                    className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
                  >
                    Why Miller &amp; Co.
                  </span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <h2
                  className={`${headlineFont.className} text-[#1a1a1a] text-4xl sm:text-5xl font-semibold leading-tight`}
                >
                  Registered Migration{" "}
                  <span className="italic text-[#c8a96e]">Lawyers</span>, Not
                  Just Agents
                </h2>
              </StaggerItem>
              <StaggerItem>
                <p
                  className={`${bodyFont.className} text-[#1a1a1a] text-base leading-relaxed`}
                >
                  Miller &amp; Co. is a specialist migration law firm. Unlike
                  migration agents, our practitioners are admitted lawyers —
                  giving you the full protection of legal professional privilege
                  and a higher standard of care from start to finish.
                </p>
              </StaggerItem>
              <StaggerContainer className="flex flex-col gap-3" stagger={0.08} delayChildren={0}>
                {[
                  "Legal professional privilege on all communications",
                  "Admitted lawyers, not agents — higher standard of care",
                  "Fixed-fee transparency on all services",
                  "End-to-end support across all visa categories",
                  "Direct partner access — no outsourcing your file",
                ].map((point) => (
                  <StaggerItem key={point}>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#c8a96e] shrink-0 mt-0.5" />
                      <span
                        className={`${bodyFont.className} text-[#1a1a1a] text-base`}
                      >
                        {point}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </StaggerContainer>

            {/* Right — stat grid */}
            <AnimateIn direction="left" delay={0.15} duration={0.8}>
              <div className="grid grid-cols-2 gap-px bg-[#1a1a1a]/10 border border-[#1a1a1a]/10">
                {[
                  { value: "98%", label: "Visa grant rate" },
                  { value: "15+", label: "Years of practice" },
                  { value: "3,000+", label: "Visas granted" },
                  { value: "50+", label: "Visa subclasses handled" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center gap-2 bg-[#faf8f5] px-6 py-10 text-center hover:bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 hover:z-10 relative transition-all duration-300"
                  >
                    <span
                      className={`${bodyFont.className} text-[#c8a96e] text-4xl font-semibold`}
                    >
                      {stat.value}
                    </span>
                    <span
                      className={`${bodyFont.className} text-[#1a1a1a] text-xs tracking-wide uppercase`}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#faf8f5] px-6 lg:px-10 pb-20">
        <div className="relative max-w-7xl mx-auto">
          <AnimateIn
            direction="up"
            duration={0.7}
            className="relative bg-[#1a1a1a] overflow-hidden px-10 py-16 lg:px-20 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10"
          >
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#c8a96e]" />
            <span className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#c8a96e]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#c8a96e08_0%,transparent_70%)] pointer-events-none" />

            {/* Text */}
            <StaggerContainer
              className="relative flex flex-col gap-4 max-w-xl"
              stagger={0.12}
              delayChildren={0.2}
            >
              <StaggerItem>
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#c8a96e]" />
                  <span
                    className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
                  >
                    Get Started Today
                  </span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <h2
                  className={`${headlineFont.className} text-white text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight`}
                >
                  Not Sure Which Visa{" "}
                  <span className="italic text-[#c8a96e]">Applies to You?</span>
                </h2>
              </StaggerItem>
              <StaggerItem>
                <p
                  className={`${bodyFont.className} text-white text-base leading-relaxed`}
                >
                  Book a confidential 30-minute consultation with our migration lawyers — AUD $220, in-person at our Bondi Junction office or via Zoom. We&apos;ll assess your situation and give you a clear roadmap.
                </p>
              </StaggerItem>
            </StaggerContainer>

            {/* Actions */}
            <AnimateIn
              direction="up"
              delay={0.45}
              duration={0.65}
              className="relative flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-4 shrink-0"
            >
              <Button
                size="lg"
                asChild
                className={`${bodyFont.className} text-xs font-bold tracking-[0.2em] uppercase bg-[#c8a96e] text-[#1a1a1a] border border-[#c8a96e] hover:bg-transparent hover:text-[#c8a96e] transition-all duration-300 rounded-none cursor-pointer`}
              >
                <a href="/contact">
                  Book a Consultation
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </Button>
              <Button
              size="lg"
              variant="outline"
              className={`${bodyFont.className} text-xs font-bold tracking-[0.2em] uppercase bg-transparent border-white/20 text-white/60 hover:text-black hover:bg-white hover:border-white/40 transition-all duration-300 rounded-none cursor-pointer`}
              onClick={() => window.location.href = "tel:+61280956369"}
            >
              <Phone className="w-3.5 h-3.5 mr-1" />
              Call Us Now
            </Button>
            </AnimateIn>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
