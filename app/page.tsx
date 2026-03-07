import HomeHero from "@/components/custom/home/hero";
import HelpSection from "@/components/custom/home/help-section";
import ExpertiseSection from "@/components/custom/home/expertise-section";
import PartnersSection from "@/components/custom/home/partners-section";
import StatsSection from "@/components/custom/home/stats-section";
import TestimonialsSection from "@/components/custom/home/testimonials-section";
import FaqSection, { type FaqItem } from "@/components/custom/home/faq-section";
import CtaSection from "@/components/custom/home/cta-section";
import PrincipalSection from "@/components/custom/home/principal-section";
import CustomHeader from "@/components/custom/shared/header";
import { adminDb } from "@/lib/firebase/admin";

async function getHomeFaqs(): Promise<FaqItem[]> {
  try {
    const snap = await adminDb
      .collection("faqs")
      .where("selectedForHome", "==", true)
      .get();

    return snap.docs
      .map((doc) => {
        const d = doc.data();
        return { q: d.question ?? "", a: d.answer ?? "", order: d.order ?? 0 };
      })
      .sort((a, b) => a.order - b.order)
      .slice(0, 5)
      .map(({ q, a }) => ({ q, a }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const faqs = await getHomeFaqs();

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
      <FaqSection faqs={faqs} />
      <CtaSection />
    </div>
  );
}
