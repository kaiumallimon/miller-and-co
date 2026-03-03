import HomeHero from "@/components/custom/home/hero";
import HelpSection from "@/components/custom/home/help-section";
import CustomHeader from "@/components/custom/shared/header";

export default function Home() {
  return (
    <div>
      <CustomHeader/>
      <HomeHero />
      <HelpSection />
    </div>
  );
}
