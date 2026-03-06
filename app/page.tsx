import HomeHero from "@/components/custom/home/hero";
import HelpSection from "@/components/custom/home/help-section";
import ExpertiseSection, { type ExpertiseItem } from "@/components/custom/home/expertise-section";
import StatsSection from "@/components/custom/home/stats-section";
import TestimonialsSection from "@/components/custom/home/testimonials-section";
import FaqSection, { type FaqItem } from "@/components/custom/home/faq-section";
import CtaSection from "@/components/custom/home/cta-section";
import CustomHeader from "@/components/custom/shared/header";
import { adminDb } from "@/lib/firebase/admin";

async function getExpertiseItems(): Promise<ExpertiseItem[]> {
  try {
    const snap = await adminDb.collection("expertise").get();
    return snap.docs
      .map((doc) => {
        const d = doc.data();
        return {
          label: d.label ?? "",
          sub: d.sub ?? null,
          isWide: d.isWide ?? false,
          order: d.order ?? 0,
        };
      })
      .sort((a, b) => a.order - b.order)
      .map(({ label, sub, isWide }) => ({ label, sub, isWide }));
  } catch {
    return [];
  }
}

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
  const [faqs, expertise] = await Promise.all([getHomeFaqs(), getExpertiseItems()]);

  return (
    <div>
      <CustomHeader/>
      <HomeHero />
      <HelpSection />
      <ExpertiseSection items={expertise} />
      <StatsSection />
      <TestimonialsSection />
      <FaqSection faqs={faqs} />
      <CtaSection />
    </div>
  );
}
