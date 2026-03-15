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
import { fetchPlaceReviewsForSchema } from "@/lib/google-places";

const FAQ_ENTRIES = [
  {
    q: "Is there a guarantee of success?",
    a: "We are not in the position of granting visas. The decision to grant or refuse a visa solely belongs to the Department of Home Affairs. However, we do guarantee that we will do all that it takes — starting from preparation of documents, submissions and all communication with your allocated Department of Home Affairs case officer — in order to receive the most favourable outcome. We will fight for you till the end!",
  },
  {
    q: "How long is the process?",
    a: "The processing times, from the initial consultation to the final submission of the visa application, varies. Usually, it depends on how quickly a client provides all necessary requested documents in support of a visa application and of course the complexity of the work involved to prepare the matter.",
  },
  {
    q: "What are the fees like?",
    a: "We do not charge hourly rates to our clients. We provide a lump sum agreement, with all fees broken down and paid for each individual bulk of work completed and invoiced. This approach enables our clients to track the progress of a visa preparation from the start to the final stage of submitting an application with the Department of Home Affairs.",
  },
  {
    q: "How much for the initial consultation?",
    a: "The initial consultation is AUD $220 for 30 minutes, conducted in-person at our Bondi Junction office or via Zoom. All appointments are strictly by prior arrangement — book through our website enquiry form or call us directly.",
  },
];

const principalPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.visa-australia.legal/#principal",
  name: "Edward Miller",
  jobTitle: "Principal",
  worksFor: {
    "@type": "Organization",
    name: "Miller & Co Lawyers & Migration Agents",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "University of Sydney",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "The College of Law",
    },
  ],
  image: "https://www.visa-australia.legal/Pic.png",
  description:
    "Australian legal practitioner holding a current practising certificate in NSW specializing in Migration Law.",
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ENTRIES.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default async function Home() {
  const reviews = await fetchPlaceReviewsForSchema();
  const enableReviewSchema = process.env.ENABLE_REVIEW_SCHEMA === "true";
  const canPublishReviewSchema = enableReviewSchema && reviews.length > 0;

  const reviewSchema = canPublishReviewSchema
    ? {
        "@context": "https://schema.org",
        "@type": "LegalService",
        name: "Miller & Co Lawyers & Migration Agents",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          reviewCount: String(reviews.length),
          bestRating: "5",
          worstRating: "1",
        },
        review: reviews.map((r) => ({
          "@type": "Review",
          author: {
            "@type": "Person",
            name: r.authorName,
          },
          reviewBody: r.reviewBody,
          datePublished: r.datePublished,
          reviewRating: {
            "@type": "Rating",
            ratingValue: String(r.ratingValue),
            bestRating: "5",
            worstRating: "1",
          },
          ...(r.reviewUrl ? { url: r.reviewUrl } : {}),
        })),
      }
    : null;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(principalPersonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
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
