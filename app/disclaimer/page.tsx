import type { Metadata } from "next";
import CustomHeader from "@/components/custom/shared/header";
import Footer from "@/components/custom/shared/footer";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { ShieldAlert, Copyright, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | Miller & Co. Migration Lawyers",
  description:
    "Read the disclaimer for Miller & Co Lawyers & Migration Agents Pty Ltd regarding website accuracy, liability, and copyright.",
};

const COMPANY = "Miller & Co Lawyers & Migration Agents Pty Ltd (trading as Miller & Co Lawyers & Migration Agents)";

const disclaimerSections = [
  {
    number: "01",
    icon: ShieldAlert,
    title: "Accuracy & Currency of Information",
    paragraphs: [
      `${COMPANY} does not warrant the accuracy or currency of any information, advice or material on this website.`,
      `${COMPANY} reserves the right to alter, vary or change information on the website at any time without notice.`,
      `${COMPANY} makes all efforts to ensure that the information and advice on this website is accurate and current — however, you should exercise your own judgment as to the veracity and accuracy of the information before relying on it.`,
      `The information or advice on this website does not substitute independent professional legal advice that you should seek before exercising any judgment in relation to the information on this website.`,
    ],
  },
  {
    number: "02",
    icon: ShieldAlert,
    title: "Limitation of Liability",
    paragraphs: [
      `${COMPANY} accepts no responsibility as a result of any actions you may take on the basis of information on this website.`,
      `Some of the information on this website summarises views or opinions of third parties which do not necessarily represent the views of ${COMPANY}. Some information may contain recommendations which you could consider, however these do not necessarily reflect the recommendations of ${COMPANY}.`,
      `Information on this website may be produced in several system formats to ensure that the information is available to a range of people with various systems.`,
    ],
  },
  {
    number: "03",
    icon: ShieldAlert,
    title: "Website Access & External Links",
    paragraphs: [
      `You access this website at your own risk. ${COMPANY} accepts no responsibility for any loss, damage or interference to your computer or other electronic devices which arise in connection with your use of this website or any other website links from this website to an external website. You must take the necessary precautions.`,
      `Website links from this site to external websites do not imply any professional relationship or otherwise with the external site or its content or endorsement of those websites.`,
    ],
  },
  {
    number: "04",
    icon: Copyright,
    title: "Copyright",
    paragraphs: [
      `Copyright in this website and its contents is owned by, or licensed to, ${COMPANY}.`,
      `Apart from the uses permitted under the Copyright Act 1968, all other rights are reserved.`,
      `Requests for authorisation to use or publish information, advice or material on this website — apart from that permitted under the Copyright Act 1968 — should be directed to info@visa-australia.legal.`,
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <CustomHeader />

      {/* Hero */}
      <section className="relative w-full overflow-hidden pt-40 pb-20 lg:pt-52 lg:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#c8a96e08_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <StaggerContainer className="flex flex-col items-center gap-5 text-center" stagger={0.1} delayChildren={0.05}>
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c8a96e]" />
                <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                  Legal
                </span>
                <span className="h-px w-10 bg-[#c8a96e]" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className={`${headlineFont.className} text-[#faf8f5] text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight`}>
                <span className="italic text-[#c8a96e]">Disclaimer</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={`${bodyFont.className} text-white/35 text-base leading-relaxed max-w-xl`}>
                Please read this disclaimer carefully before using the Miller &amp; Co. website. By accessing or using the site, you agree to the terms set out below.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Breadcrumb */}
        <div className={`${bodyFont.className} absolute bottom-8 right-6 lg:right-10 text-[#c8a96e] text-[10px] tracking-widest uppercase flex items-center gap-2`}>
          <Link href="/" className="hover:text-[#c8a96e]/80 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white/50">Disclaimer</span>
        </div>
      </section>

      {/* Content */}
      <section className="relative max-w-5xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="flex flex-col gap-16">
          {disclaimerSections.map((section) => {
            const Icon = section.icon;
            return (
              <AnimateIn key={section.number} direction="up" delay={0.05}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                  {/* Left — number + icon */}
                  <div className="lg:col-span-3 flex flex-row lg:flex-col items-start gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-9 h-9 bg-[#c8a96e]/10 border border-[#c8a96e]/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#c8a96e]" />
                      </div>
                      <span className={`${headlineFont.className} text-[#c8a96e]/30 text-3xl font-semibold leading-none`}>
                        {section.number}
                      </span>
                    </div>
                    <div className="h-px w-full bg-white/5 lg:mt-4 hidden lg:block" />
                  </div>

                  {/* Right — content */}
                  <div className="lg:col-span-9 flex flex-col gap-5 border-l border-white/6 pl-6 lg:pl-8">
                    <h2 className={`${headlineFont.className} text-[#faf8f5] text-2xl sm:text-3xl font-semibold leading-snug`}>
                      {section.title}
                    </h2>
                    <div className="flex flex-col gap-4">
                      {section.paragraphs.map((para, i) => (
                        <p key={i} className={`${bodyFont.className} text-white/45 text-base leading-relaxed`}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>

        {/* Contact note */}
        <AnimateIn direction="up" delay={0.1} className="mt-20">
          <div className="relative bg-[#141414] border border-white/6 overflow-hidden px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#c8a96e]" />
            <span className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#c8a96e]" />
            <div className="flex flex-col gap-2">
              <p className={`${headlineFont.className} text-[#faf8f5] text-xl font-semibold`}>
                Have a legal question?
              </p>
              <p className={`${bodyFont.className} text-white/35 text-base`}>
                Contact our team for independent professional legal advice.
              </p>
            </div>
            <a
              href="/contact"
              className={`${bodyFont.className} shrink-0 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase bg-transparent border border-[#c8a96e]/40 text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0f0f0f] hover:border-[#c8a96e] transition-all duration-300 px-5 py-2.5`}
            >
              Contact Us
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </AnimateIn>
      </section>

    </div>
  );
}
