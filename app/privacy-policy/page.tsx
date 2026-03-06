import type { Metadata } from "next";
import CustomHeader from "@/components/custom/shared/header";
import Footer from "@/components/custom/shared/footer";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { Lock, UserCheck, Share2, Database, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Miller & Co. Migration Lawyers",
  description:
    "Read the privacy policy for Miller & Co Lawyers & Migration Agents Pty Ltd regarding the collection, use and disclosure of personal information.",
};

const COMPANY = "Miller & Co Lawyers & Migration Agents Pty Ltd (trading as Miller & Co Lawyers & Migration Agents)";

const privacySections = [
  {
    number: "01",
    icon: Database,
    title: "Collection of Information",
    paragraphs: [
      `Personal information will only be collected with your consent.`,
      `Depending on the service you require, we may ask you to provide information such as your name, email address or your educational or employment history, but it is your choice whether to respond or not.`,
      `We will not collect personal information secretly or in an improper manner.`,
    ],
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Use of Information",
    bullets: [
      "Information will only be used for the purpose for which it was collected.",
      `Information may be used to keep you better informed about services provided by ${COMPANY} — such as by way of a newsletter or other communication medium.`,
      "Personal information will not be used for a secondary purpose unless required by law enforcement authorities.",
    ],
  },
  {
    number: "03",
    icon: Share2,
    title: "Disclosure",
    paragraphs: [
      `Information will only be used or disclosed for the purpose for which it was collected. However, personal information will be disclosed for a secondary purpose or disclosed to a third party to provide the services you require or if required by law enforcement authorities.`,
      `We may provide your personal information to third parties to continue to provide you with the services for which you originally supplied the information.`,
    ],
  },
  {
    number: "04",
    icon: Lock,
    title: "Your Rights & The Privacy Act",
    paragraphs: [
      `This Privacy Policy has been drafted with regard to the Privacy Act 1988 (Cth). You have the right to access personal information that ${COMPANY} holds about you and to request corrections where the information is inaccurate, out of date, incomplete or misleading.`,
      `To request access to or correction of your personal information, or to make a privacy complaint, please contact us at info@visa-australia.legal.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
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
                Privacy{" "}
                <span className="italic text-[#c8a96e]">Policy</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={`${bodyFont.className} text-white/35 text-sm leading-relaxed max-w-xl`}>
                This Privacy Policy sets out the approach ${COMPANY.split(" (")[0]} will take in relation to the collection, use and disclosure of your personal information under the Privacy Act 1988.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Breadcrumb */}
        <div className={`${bodyFont.className} absolute bottom-8 right-6 lg:right-10 text-[#c8a96e] text-[10px] tracking-widest uppercase flex items-center gap-2`}>
          <Link href="/" className="hover:text-[#c8a96e]/80 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white/50">Privacy Policy</span>
        </div>
      </section>

      {/* Content */}
      <section className="relative max-w-5xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="flex flex-col gap-16">
          {privacySections.map((section) => {
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

                    {"paragraphs" in section && section.paragraphs && (
                      <div className="flex flex-col gap-4">
                        {section.paragraphs.map((para, i) => (
                          <p key={i} className={`${bodyFont.className} text-white/45 text-sm leading-relaxed`}>
                            {para}
                          </p>
                        ))}
                      </div>
                    )}

                    {"bullets" in section && section.bullets && (
                      <ul className="flex flex-col gap-3">
                        {section.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-1 h-1 rounded-full bg-[#c8a96e] shrink-0 mt-2" />
                            <p className={`${bodyFont.className} text-white/45 text-sm leading-relaxed`}>
                              {bullet}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
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
                Questions about your privacy?
              </p>
              <p className={`${bodyFont.className} text-white/35 text-sm`}>
                Contact us to access, correct or enquire about personal information we hold.
              </p>
            </div>
            <a
              href="mailto:info@visa-australia.legal"
              className={`${bodyFont.className} shrink-0 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase bg-transparent border border-[#c8a96e]/40 text-[#c8a96e] hover:bg-[#c8a96e] hover:text-[#0f0f0f] hover:border-[#c8a96e] transition-all duration-300 px-5 py-2.5`}
            >
              Contact Us
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </AnimateIn>
      </section>

      <Footer />
    </div>
  );
}
