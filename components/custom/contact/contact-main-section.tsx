import { headlineFont, bodyFont } from "@/lib/typographies";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { StaggerContainer, StaggerItem, AnimateIn } from "@/components/AnimateIn";
import ContactForm from "./contact-form";

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: "+61 2 8095 6369",
    href: "tel:+61280956369",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@visa-australia.legal",
    href: "mailto:info@visa-australia.legal",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Level 22, Westfield Tower Two\n101 Grafton Street, Bondi Junction\nNSW 2022, Australia",
    href: "https://maps.google.com/?q=101+Grafton+Street+Bondi+Junction",
  },
];

const officeHours = [
  { day: "Monday – Friday", hours: "9:00 am – 6:00 pm" },
  { day: "Saturday", hours: "9:00 am – 12:00 noon" },
  { day: "Sunday", hours: "9:00 am to 12:00 noon" },
];

export default function ContactMainSection() {
  return (
    <section className="relative w-full bg-[#faf8f5] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#c8a96e08_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 lg:gap-20 items-start">

          {/* ── Left: info panel (2/5) ─────────────────────────────── */}
          <StaggerContainer
            className="lg:col-span-2 flex flex-col gap-10"
            stagger={0.12}
            delayChildren={0.05}
          >
            {/* Eyebrow + heading */}
            <StaggerItem className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c8a96e]" />
                <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                  Contact Details
                </span>
              </div>
              <h2 className={`${headlineFont.className} text-[#1a1a1a] text-3xl sm:text-4xl font-semibold leading-tight`}>
                We&apos;d Love to{" "}
                <span className="italic text-[#c8a96e]">Hear From You</span>
              </h2>
              <p className={`${bodyFont.className} text-[#1a1a1a]/55 text-base leading-relaxed`}>
                Whether you have a question about your visa options, need to book a
                consultation, or want to discuss your circumstances — reach out and
                one of our team will be in touch promptly.
              </p>
            </StaggerItem>

            {/* Contact cards */}
            <StaggerContainer className="flex flex-col gap-3" stagger={0.09} delayChildren={0}>
              {contactDetails.map((item) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.label}>
                    <a
                      href={item.href}
                      target={item.icon === MapPin ? "_blank" : undefined}
                      rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-4 p-4 bg-white border border-[#1a1a1a]/6 hover:border-[#c8a96e]/40 hover:bg-[#c8a96e]/3 transition-all duration-300"
                    >
                      <div className="w-9 h-9 flex items-center justify-center bg-[#c8a96e]/10 shrink-0 group-hover:bg-[#c8a96e]/20 transition-colors duration-300">
                        <Icon className="w-4 h-4 text-[#c8a96e]" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1a1a1a]/40`}>
                          {item.label}
                        </p>
                        <p className={`${bodyFont.className} text-[#1a1a1a] text-base leading-relaxed whitespace-pre-line group-hover:text-[#c8a96e] transition-colors duration-300`}>
                          {item.value}
                        </p>
                      </div>
                    </a>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            {/* Office hours */}
            <StaggerItem>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#c8a96e]" />
                  <span className={`${bodyFont.className} text-[10px] font-semibold tracking-[0.3em] uppercase text-[#1a1a1a]/50`}>
                    Office Hours
                  </span>
                </div>
                <div className="flex flex-col gap-2 pl-7">
                  {officeHours.map(({ day, hours }) => (
                    <div key={day} className="flex items-center justify-between gap-4 text-base">
                      <span className={`${bodyFont.className} text-[#1a1a1a]/60`}>{day}</span>
                      <span className={`${bodyFont.className} text-[#1a1a1a]/70 text-right`}>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* ── Right: form (3/5) ─────────────────────────────────── */}
          <AnimateIn
            direction="left"
            duration={0.75}
            delay={0.12}
            className="lg:col-span-3"
          >
            <ContactForm />
          </AnimateIn>

        </div>
      </div>
    </section>
  );
}
