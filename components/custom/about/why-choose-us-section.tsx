import { headlineFont, bodyFont } from "@/lib/typographies";
import {
  Scale,
  User,
  MessageSquare,
  FileCheck,
  Handshake,
  Target,
} from "lucide-react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

const reasons = [
  {
    icon: Scale,
    title: "Experienced Legal Guidance",
    description:
      "Led by Edward Miller, a qualified Australian Migration Lawyer, our firm provides reliable legal advice based on a strong understanding of Australian immigration law and procedures. Each case is carefully assessed to identify the most suitable visa pathway.",
  },
  {
    icon: User,
    title: "Personalised Approach",
    description:
      "Every client's situation is different. We take the time to understand your background, goals, and circumstances so we can provide tailored advice and the best possible strategy for your application.",
  },
  {
    icon: MessageSquare,
    title: "Transparent and Honest Advice",
    description:
      "We believe in clear communication and transparency. Our clients receive straightforward advice about their options, the process involved, and what to realistically expect at each stage.",
  },
  {
    icon: FileCheck,
    title: "Careful Case Preparation",
    description:
      "Visa applications require accuracy, strong documentation, and attention to detail. Our team ensures that each application is prepared carefully to meet all legal requirements and minimise delays or complications.",
  },
  {
    icon: Handshake,
    title: "Support From Start to Finish",
    description:
      "From the initial consultation through to visa submission and communication with the Department of Home Affairs, we guide and support you at every step of the process.",
  },
  {
    icon: Target,
    title: "Focused on Your Future",
    description:
      "Migration is often one of the most important decisions in a person's life. Our goal is to make the process clearer, less stressful, and professionally managed so you can focus on building your future in Australia.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative w-full bg-[#1a1a1a] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#c8a96e08_0%,transparent_65%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">

        {/* Section Header */}
        <StaggerContainer
          className="flex flex-col items-center gap-4 mb-16"
          stagger={0.12}
          delayChildren={0.05}
        >
          <StaggerItem>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#c8a96e]" />
              <span
                className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.3em] uppercase`}
              >
                Our Difference
              </span>
              <span className="h-px w-10 bg-[#c8a96e]" />
            </div>
          </StaggerItem>
          <StaggerItem>
            <h2
              className={`${headlineFont.className} text-white text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-center leading-tight`}
            >
              Why Choose{" "}
              <span className="italic text-[#c8a96e]">Miller & Co.</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p
              className={`${bodyFont.className} text-white/75 text-base text-center max-w-xl leading-relaxed mt-1`}
            >
              Choosing the right migration lawyer can make a significant difference
              to the success of your visa application. We focus on clear guidance,
              strong legal support, and a client-first approach throughout the
              entire migration process.
            </p>
          </StaggerItem>
        </StaggerContainer>

        {/* Cards grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5"
          stagger={0.08}
          delayChildren={0.05}
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <StaggerItem
                key={reason.title}
                className="group relative flex flex-col gap-4 bg-[#1a1a1a] px-7 py-8 hover:bg-[#c8a96e]/5 transition-colors duration-300 cursor-default"
              >
                {/* Gold left accent on hover */}
                <span className="absolute left-0 top-0 h-full w-0.5 bg-[#c8a96e] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />

                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-[#c8a96e]/30 transition-colors duration-300">
                  <Icon className="w-4.5 h-4.5 text-[#c8a96e]" />
                </div>

                {/* Title */}
                <p
                  className={`${headlineFont.className} text-white text-lg md:text-2xl font-medium leading-snug group-hover:text-[#c8a96e] transition-colors duration-300`}
                >
                  {reason.title}
                </p>

                {/* Description */}
                <p className={`${bodyFont.className} text-white/60 text-base leading-relaxed`}>
                  {reason.description}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

      </div>
    </section>
  );
}
