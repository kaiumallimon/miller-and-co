import type { Metadata } from "next";
import Image from "next/image";
import CustomHeader from "@/components/custom/shared/header";
import BlogListClient from "@/components/custom/blog/BlogListClient";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

export const metadata: Metadata = {
  title: "Blog | Insights & Immigration Updates",
  description:
    "Stay informed with expert articles on Australian visa categories, migration law changes, and immigration strategies from the team at Miller & Co.",
};

export default function BlogPage() {
  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <CustomHeader />

      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden pt-40 pb-20 lg:pt-52 lg:pb-28">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/1-mobile.png"
            alt=""
            fill
            priority
            className="object-cover object-center md:hidden"
          />
          <Image
            src="/1.png"
            alt=""
            fill
            priority
            className="object-cover object-center hidden md:block"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#c8a96e08_0%,transparent_65%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <StaggerContainer className="flex flex-col items-center gap-5 text-center" stagger={0.12} delayChildren={0.1}>
            <StaggerItem>
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#c8a96e]" />
                <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
                  Miller & Co. Blog
                </span>
                <span className="h-px w-10 bg-[#c8a96e]" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className={`${headlineFont.className} text-[#faf8f5] text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight`}>
                Insights &amp;{" "}
                <span className="italic text-[#c8a96e]">Updates</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={`${bodyFont.className} text-white/40 text-base leading-relaxed max-w-lg`}>
                Expert commentary on Australian migration law, visa pathways,
                and immigration policy — from our team of registered migration lawyers.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className={`${bodyFont.className} flex items-center gap-6 text-[11px] text-white/20 mt-2`}>
                <span>Updated regularly</span>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Breadcrumb */}
        <AnimateIn direction="left" delay={0.5} duration={0.6} className="absolute bottom-8 right-6 lg:right-10">
          <div
            className={`${bodyFont.className} text-[#c8a96e] text-[10px] tracking-widest uppercase flex items-center gap-2`}
          >
            <span>Home</span>
            <span className="text-[#c8a96e]">/</span>
            <span className="text-white/60">Blog</span>
          </div>
        </AnimateIn>

        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />
      </section>

      {/* ── Posts ──────────────────────────────────────────────────────────── */}
      <BlogListClient />
    </div>
  );
}
