"use client";

import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import CountUp from "@/components/CountUp";

const stats = [
  { value: 10230, label: "Completed Cases" },
  { value: 10100, label: "Successful Cases" },
  { value: 130, label: "In the Process of Approval" },
];

export default function StatsSection() {
  return (
    <section className="relative w-full bg-[#faf8f5] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#c8a96e08_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-24 lg:pt-32">

        {/* Section header */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#c8a96e]" />
            <span
              className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}
            >
              Our Track Record
            </span>
            <span className="h-px w-10 bg-[#c8a96e]" />
          </div>
          <h2
            className={`${headlineFont.className} text-[#1a1a1a] text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-center leading-tight`}
          >
            Proven Results,{" "}
            <span className="italic text-[#c8a96e]">Real People</span>
          </h2>
        </div>

        {/* Full-width image */}
        <div className="relative w-full h-70 sm:h-95 lg:h-115 overflow-hidden">
          {/* Gold border frame */}
          <div className="absolute -top-3 -right-3 w-full h-full border border-[#c8a96e]/25 z-0 pointer-events-none" />
          <div className="relative w-full h-full z-10">
            <Image
              src="/4.png"
              alt="Miller & Co – Legal Consultation"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a]/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1a1a1a]/10  border-t-0 bg-white">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group flex flex-col items-center justify-center gap-2 px-8 py-10 hover:bg-[#1a1a1a] border border-[#1a1a1a]/10 transition-colors duration-500"
            >
              <span
                className={`${bodyFont.className} text-5xl lg:text-6xl font-semibold text-[#c8a96e] leading-none group-hover:text-white transition-colors duration-500`}
              >
                <CountUp to={stat.value} separator="," duration={2.5} />
              </span>
              <span
                className={`${bodyFont.className} text-[10px] tracking-[0.25em] uppercase text-[#1a1a1a]/40 text-center group-hover:text-white/50 transition-colors duration-500`}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom padding spacer */}
      <div className="pb-24 lg:pb-32" />
    </section>
  );
}
