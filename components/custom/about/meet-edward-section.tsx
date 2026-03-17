"use client";

import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { GraduationCap, Briefcase, BadgeCheck } from "lucide-react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { useParallax } from "@/hooks/useParallax";
import { motion } from "motion/react";

const credentials = [
  {
    icon: GraduationCap,
    label: "Bachelor of Laws",
    detail: "University of Sydney",
  },
  {
    icon: GraduationCap,
    label: "Graduate Diploma of Legal Practice",
    detail: "College of Law",
  },
  {
    icon: BadgeCheck,
    label: "Registered Australian Migration Lawyer",
    detail: "Department of Home Affairs",
  },
  {
    icon: Briefcase,
    label: "Principal of Miller & Co.",
    detail: "Migration Lawyer & Legal Advisor",
  },
];

export default function MeetEdwardSection() {
  const { ref: imgRef, y: imgY } = useParallax(40);

  return (
    <section className="relative w-full bg-[#faf8f5] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#c8a96e08_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 lg:pt-22 pb-6 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Image */}
          <AnimateIn
            direction="right"
            duration={0.8}
            delay={0.1}
            className="relative w-full aspect-4/5 lg:aspect-auto lg:h-150 order-2 lg:order-1"
          >
            {/* Gold border accent – mirrored (top-left) */}
            <div className="absolute -top-4 -left-4 w-full h-full border border-[#c8a96e]/30 z-0" />

            <div ref={imgRef} className="relative w-full h-full overflow-hidden z-10">
              <motion.div
                style={{ y: imgY, position: "absolute", top: -45, bottom: -45, left: 0, right: 0 }}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/212.png"
                  alt="Edward Miller – Principal Migration Lawyer"
                  fill
                  className="object-cover object-top"
                />
              </motion.div>
              <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a]/30 via-transparent to-transparent" />
            </div>

            {/* Floating name card */}
            <AnimateIn
              direction="up"
              delay={0.45}
              duration={0.65}
              className="absolute -bottom-6 -right-6 z-20 bg-[#756341] border border-white px-6 py-5 shadow-xl"
            >
              <p className={`${headlineFont.className} text-white text-2xl font-semibold`}>
                Edward Miller
              </p>
              <p className={`${bodyFont.className} text-white/60 text-xs mt-1 tracking-wide uppercase`}>
                Principal Migration Lawyer
              </p>
            </AnimateIn>
          </AnimateIn>

          {/* Right: Text */}
          <StaggerContainer
            className="flex flex-col gap-7 order-1 lg:order-2"
            stagger={0.12}
            delayChildren={0.05}
          >
            {/* Eyebrow */}
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#756341]" />
                <span
                  className={`${bodyFont.className} text-[#756341] text-[12px] font-semibold tracking-[0.3em] uppercase`}
                >
                  Meet Our Principal
                </span>
              </div>
            </StaggerItem>

            {/* Heading */}
            <StaggerItem>
              <h2
                className={`${headlineFont.className} text-[#1a1a1a] text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-tight`}
              >
                Edward{" "}
                <span className="italic text-[#756341]">Miller</span>
              </h2>
            </StaggerItem>

            {/* Role line */}
            <StaggerItem>
              <p className={`${bodyFont.className} text-[#756341] text-sm font-semibold tracking-[0.05em] uppercase`}>
                Australian Immigration Lawyer Practising Certificate (NSW) Migration Law Specialist
              </p>
            </StaggerItem>

            {/* Bio paragraphs */}
            <StaggerItem>
              <p className={`${bodyFont.className} text-[#1a1a1a]/75 text-base leading-relaxed`}>
                Edward Miller is the Principal of Miller & Co Lawyers & Migration Agents and a registered Australian legal practitioner holding a current practising certificate in NSW specializing in migration law who has helped individuals, families, and businesses navigate Australia&apos;s
                immigration system with confidence.
              </p>
            </StaggerItem>

            <StaggerItem>
              <p className={`${bodyFont.className} text-[#1a1a1a]/75 text-base leading-relaxed`}>
                With years of experience in migration law, Edward has assisted
                clients across a wide range of visa applications, including
                employer-sponsored visas, skilled migration, partner visas,
                business and investment visas, and Australian citizenship matters.
                He also provides professional support for visa refusals,
                cancellations, and appeals.
              </p>
            </StaggerItem>

            {/* <StaggerItem>
              <p className={`${bodyFont.className} text-[#1a1a1a]/75 text-base leading-relaxed`}>
                Edward is known for his clear communication, attention to detail,
                and practical legal advice. He takes the time to understand each
                client&apos;s circumstances and develops a strategy that aligns
                with their goals while ensuring full compliance with Australian
                immigration law.
              </p>
            </StaggerItem> */}

            {/* Credentials */}
            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2"
              stagger={0.08}
              delayChildren={0}
            >
              {credentials.map((cred) => {
                const Icon = cred.icon;
                return (
                  <StaggerItem key={cred.label} className="h-full">
                    <div className="h-full flex items-start gap-3 p-5 border border-[#1a1a1a]/8 bg-white/60 hover:bg-white transition-colors duration-300 group">
                      <div className="mt-0.5 w-10 h-10 flex items-center justify-center bg-[#c8a96e]/10 shrink-0">
                        <Icon className="w-5 h-5 text-[#c8a96e]" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className={`${bodyFont.className} text-[#1a1a1a] text-sm font-semibold leading-snug`}>
                          {cred.label}
                        </p>
                        <p className={`${bodyFont.className} text-[#1a1a1a]/60 text-xs`}>
                          {cred.detail}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

          </StaggerContainer>

        </div>
      </div>
    </section>
  );
}
