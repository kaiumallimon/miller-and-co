import type { Metadata } from "next";
import CustomHeader from "@/components/custom/shared/header";
import AboutHero from "@/components/custom/about/about-hero";
import AboutFirmSection from "@/components/custom/about/about-firm-section";
import WhyChooseUsSection from "@/components/custom/about/why-choose-us-section";
import MeetEdwardSection from "@/components/custom/about/meet-edward-section";
import StatsSection from "@/components/custom/home/stats-section";
import CtaSection from "@/components/custom/home/cta-section";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Miller & Co Lawyers & Migration Agents — a Sydney-based migration law firm led by Edward Miller, Principal Migration Lawyer. With over 10,000 successful cases, we help individuals, families, and businesses navigate Australia's immigration system.",
};

export default function AboutPage() {
  return (
    <div>
      <CustomHeader />
      <AboutHero />
      <AboutFirmSection />
      <WhyChooseUsSection />
      <MeetEdwardSection />
      <StatsSection />
      <CtaSection />
    </div>
  );
}
