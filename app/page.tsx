import HomeHero from "@/components/custom/home/hero";
import HelpSection from "@/components/custom/home/help-section";
import ExpertiseSection from "@/components/custom/home/expertise-section";
import PartnersSection from "@/components/custom/home/partners-section";
import StatsSection from "@/components/custom/home/stats-section";
import TestimonialsSection from "@/components/custom/home/testimonials-section";
import FaqSection from "@/components/custom/home/faq-section";
import CtaSection from "@/components/custom/home/cta-section";
import PrincipalSection from "@/components/custom/home/principal-section";
import CustomHeader from "@/components/custom/shared/header";

export default async function Home() {
  return (
    <div>
      <CustomHeader/>
      <HomeHero />
      <HelpSection />
      <ExpertiseSection />
      <StatsSection />
      <PrincipalSection />
      <TestimonialsSection />
      <PartnersSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
