import type { Metadata } from "next";
import CustomHeader from "@/components/custom/shared/header";
import Footer from "@/components/custom/shared/footer";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { Lock, UserCheck, Share2, Database, ArrowRight, ShieldCheck, Scale, Globe } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Miller & Co. Migration Lawyers",
  description:
    "Australian Privacy Principles (APP) compliant privacy policy for Miller & Co Lawyers & Migration Agents Pty Ltd, including collection, use, disclosure, access, correction and complaint handling.",
};

const COMPANY = "Miller & Co Lawyers & Migration Agents Pty Ltd (trading as Miller & Co Lawyers & Migration Agents)";
const CONTACT_EMAIL = "info@visa-australia.legal";
const CONTACT_PHONE = "+61 2 8095 6369";
const CONTACT_ADDRESS = "Level 22, Westfield Tower Two, 101 Grafton Street, Bondi junction NSW 2022, Australia";

const privacySections = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "APP 1 — Open & Transparent Management",
    paragraphs: [
      `${COMPANY} manages personal information in accordance with the Privacy Act 1988 (Cth), including the Australian Privacy Principles (APPs).`,
      `This Privacy Policy explains what personal information we collect, how we use and disclose it, how you can access or correct it, and how to lodge a privacy complaint.`,
      `We review this policy periodically and update it where legal, operational, or technological changes require.`
    ],
  },
  {
    number: "02",
    icon: Database,
    title: "APP 2, APP 3 & APP 4 — Collection of Personal Information",
    paragraphs: [
      `We collect personal information that is reasonably necessary for our legal and migration services, including your name, contact details, visa and immigration history, identity documents, employment and education history, and other information relevant to your matter.`,
      `Where necessary to provide legal services, we may collect sensitive information (for example, health, biometric, criminal history, or other sensitive data) with your consent or where otherwise permitted by law.`,
      `We generally collect personal information directly from you through website forms, email, phone calls, consultations, onboarding forms, and supporting documents you provide. We may also collect from third parties (such as the Department of Home Affairs, ART, courts, medical providers, employers, referees, or other agents) where authorised by you or required/permitted by law.`,
      `If we receive unsolicited personal information and it is not reasonably necessary for our functions and activities, we will destroy or de-identify it where lawful and practicable.`
    ],
  },
  {
    number: "03",
    icon: UserCheck,
    title: "APP 5 — Collection Notice",
    bullets: [
      `We collect your personal information so we can assess your enquiry, provide legal and migration advice, prepare and lodge applications, communicate with government bodies and third parties, manage billing and administration, and comply with legal/professional obligations.`,
      `If you do not provide requested information, we may be unable to assess your eligibility, progress your matter, or provide complete legal services.`,
      `Our collection notices are provided at or before the time of collection (including on our contact form and engagement documents).`,
    ],
  },
  {
    number: "04",
    icon: Share2,
    title: "APP 6, APP 7, APP 8 & APP 9 — Use, Disclosure, Direct Marketing, Overseas Disclosure & Government Identifiers",
    paragraphs: [
      `We use and disclose personal information primarily for the purpose for which it was collected and for related purposes you would reasonably expect. This includes disclosure to government agencies, tribunals, courts, barristers/experts, interpreters/translators, technology providers, and other service providers who assist us to deliver services.`,
      `We may disclose personal information where required or authorised by law, court order, professional conduct rules, or to protect legal rights.`,
      `We do not sell personal information. We do not use personal information for unrelated direct marketing without consent or other legal basis. You may opt out of marketing communications at any time.`,
      `Some service providers may store or process data outside Australia (for example, cloud-based communication and document systems). Where overseas disclosure occurs, we take reasonable steps to ensure privacy protections are in place consistent with APP 8.`,
      `Government-related identifiers (such as passport details or visa reference numbers) are used only where reasonably necessary for legal/migration service delivery or as required by law.`
    ],
  },
  {
    number: "05",
    icon: Lock,
    title: "APP 10, APP 11, APP 12 & APP 13 — Data Quality, Security, Access, Correction & Complaints",
    paragraphs: [
      `We take reasonable steps to ensure personal information is accurate, up to date, complete and relevant, and we implement safeguards to protect information from misuse, interference, loss, and unauthorised access, modification or disclosure.`,
      `You may request access to personal information we hold about you and request correction if it is inaccurate, out of date, incomplete, irrelevant, or misleading. In limited circumstances permitted by law, access may be refused and we will provide reasons.`,
      `You can make a privacy complaint by contacting us using the details below. We aim to acknowledge complaints promptly and provide a substantive response within a reasonable time (generally within 30 days). If you are dissatisfied, you may complain to the Office of the Australian Information Commissioner (OAIC).`,
      `Retention: we keep personal information only for as long as required for legal, regulatory, professional indemnity, and operational purposes, after which information is securely destroyed or de-identified where lawful and practicable.`
    ],
  },
  {
    number: "06",
    icon: Globe,
    title: "Website, Cookies & Analytics",
    paragraphs: [
      `Our website may use cookies and similar technologies for security, performance, and analytics. Some technical information (such as IP address, browser type, and device data) may be collected automatically when you visit our site.`,
      `You can control cookies through your browser settings; however, some website functions may be affected if cookies are disabled.`
    ],
  },
  {
    number: "07",
    icon: Scale,
    title: "How to Contact Us",
    bullets: [
      `Email: ${CONTACT_EMAIL}`,
      `Phone: ${CONTACT_PHONE}`,
      `Address: ${CONTACT_ADDRESS}`,
      "Please include your full name, preferred contact details, and sufficient detail to identify the matter when making an access, correction, or complaint request."
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
              <p className={`${bodyFont.className} text-white/35 text-base leading-relaxed max-w-xl`}>
                This policy explains how we collect, hold, use and disclose your personal information under the Privacy Act 1988 (Cth) and the Australian Privacy Principles.
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
                          <p key={i} className={`${bodyFont.className} text-white/45 text-base leading-relaxed`}>
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
                            <p className={`${bodyFont.className} text-white/45 text-base leading-relaxed`}>
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
              <p className={`${bodyFont.className} text-white/35 text-base`}>
                Contact us to request access/correction of your personal information or to lodge a privacy complaint.
              </p>
              <p className={`${bodyFont.className} text-white/45 text-sm`}>
                {CONTACT_EMAIL} · {CONTACT_PHONE}
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

      <Footer />

    </div>
  );
}
