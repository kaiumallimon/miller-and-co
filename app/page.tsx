import HomeHero from "@/components/custom/home/hero";
import HelpSection from "@/components/custom/home/help-section";
import ExpertiseSection from "@/components/custom/home/expertise-section";
import StatsSection from "@/components/custom/home/stats-section";
import TestimonialsSection from "@/components/custom/home/testimonials-section";
import CustomHeader from "@/components/custom/shared/header";

export default function Home() {
  return (
    <div>
      <CustomHeader/>
      <HomeHero />
      <HelpSection />
      <ExpertiseSection />
      <StatsSection />
      <TestimonialsSection />
    </div>
  );
}
