import type { Metadata } from "next";
import CustomHeader from "@/components/custom/shared/header";
import ContactHero from "@/components/custom/contact/contact-hero";
import ContactMainSection from "@/components/custom/contact/contact-main-section";
import CtaSection from "@/components/custom/home/cta-section";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Miller & Co Lawyers & Migration Agents in Sydney. Book a consultation or send us an enquiry — our migration law team will respond promptly.",
};

export default function ContactPage() {
  return (
    <div>
      <CustomHeader />
      <ContactHero />
      <ContactMainSection />
      <CtaSection />
    </div>
  );
}
