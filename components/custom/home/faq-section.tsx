"use client";

import { useState } from "react";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

const FALLBACK_FAQS: FaqItem[] = [
  {
    q: "Is there a guarantee of success?",
    a: "We are not in the position of granting visas. The decision to grant or refuse a visa solely belongs to the Department of Immigration (DOHA). However, we do guarantee that we will do all that it takes — starting from preparation of documents, submissions and all communication with your allocated DOHA case manager — in order to receive the most favourable outcome. We will fight for you till the end!",
  },
  {
    q: "How long is the process?",
    a: "The processing times, from the initial consultation to the final submission of the visa application, varies. Usually, it depends on how quickly a client provides all necessary requested documents in support of a visa application and of course the complexity of the work involved to prepare the matter.",
  },
  {
    q: "What are the fees like?",
    a: "We do not charge hourly rates to our clients. We provide a lump sum agreement, with all fees broken down and paid for each individual bulk of work completed and invoiced. This approach enables our clients to track the progress of a visa preparation from the start to the final stage of submitting an application with the DOHA.",
  },
  {
    q: "How much for the initial consultation?",
    a: "The initial face-to-face consultation is $380. All consultations are made strictly by appointment — either over the phone or through our website enquiry form. However, if for some reason you are unable to see us in person, we offer an online Zoom Consultation.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FaqSection({ faqs }: { faqs?: FaqItem[] }) {
  const items = faqs && faqs.length > 0 ? faqs : FALLBACK_FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative w-full bg-[#faf8f5] overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#e8e0d4]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* ── Left: Section header ──────────────────────────────────── */}
          <StaggerContainer
            className="flex flex-col gap-5 lg:w-[38%] lg:sticky lg:top-32 lg:self-start"
            stagger={0.12}
            delayChildren={0.05}
          >
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c8a96e]" />
                <span
                  className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
                >
                  Common Questions
                </span>
              </div>
            </StaggerItem>

            <StaggerItem>
              <h2
                className={`${headlineFont.className} text-[#1a1a1a] text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-tight`}
              >
                Frequently{" "}
                <span className="italic text-[#c8a96e]">Asked</span>
              </h2>
            </StaggerItem>

            <StaggerItem>
              <p
                className={`${bodyFont.className} text-[#1a1a1a]/50 text-sm leading-relaxed max-w-sm`}
              >
                Get clear answers to the most common questions about our
                migration services, fees and process.
              </p>
            </StaggerItem>

            {/* Decorative gold block */}
            <StaggerItem>
              <div className="mt-4 flex items-start gap-4">
                <p
                  className={`${bodyFont.className} border-l-3 border-[#c8a96e] px-5  text-[#1a1a1a]/40 text-xs leading-relaxed italic`}
                >
                  Can&apos;t find what you&apos;re looking for? Contact our
                  team for a personalised answer.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* ── Right: Accordion ──────────────────────────────────────── */}
          <div className="flex flex-col gap-0 lg:flex-1 divide-y divide-[#e8e0d4] border-t border-b border-[#e8e0d4]">
            {items.map((faq, i) => (
              <AnimateIn key={i} direction="up" delay={i * 0.07} duration={0.55}>
                <div>
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left group cursor-pointer"
                    aria-expanded={openIndex === i}
                  >
                    <span
                      className={`${headlineFont.className} text-[#1a1a1a] text-xl lg:text-2xl font-semibold leading-snug group-hover:text-[#c8a96e] transition-colors duration-300`}
                    >
                      {faq.q}
                    </span>
                    <span className="shrink-0 mt-1 w-7 h-7 flex items-center justify-center border border-[#c8a96e]/40 text-[#c8a96e] group-hover:bg-[#c8a96e] group-hover:text-[#1a1a1a] transition-all duration-300">
                      {openIndex === i ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-7 pl-0 pr-10">
                          <div className="flex gap-4">
                            <span className="w-0.5 shrink-0 bg-[#c8a96e]/40 self-stretch" />
                            <p
                              className={`${bodyFont.className} text-[#1a1a1a]/60 text-sm leading-relaxed`}
                            >
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimateIn>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
