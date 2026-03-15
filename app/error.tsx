"use client";

import Link from "next/link";
import { useEffect } from "react";
import { bodyFont, headlineFont } from "@/lib/typographies";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#faf8f5] flex items-center justify-center px-6">
      <div className="max-w-xl w-full border border-white/10 bg-[#141414] p-8 sm:p-10">
        <p className={`${bodyFont.className} text-[#c8a96e] text-[11px] tracking-[0.25em] uppercase mb-3`}>
          Error 500
        </p>
        <h1 className={`${headlineFont.className} text-3xl sm:text-4xl font-semibold leading-tight mb-4`}>
          Something went wrong.
        </h1>
        <p className={`${bodyFont.className} text-white/55 text-sm leading-relaxed mb-8`}>
          We couldn&apos;t complete your request. Please try again, or return to the home page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className={`${bodyFont.className} px-5 py-3 text-[11px] tracking-[0.18em] uppercase font-semibold bg-[#c8a96e] text-[#1a1a1a] hover:opacity-90 transition-opacity`}
          >
            Try Again
          </button>
          <Link
            href="/"
            className={`${bodyFont.className} px-5 py-3 text-[11px] tracking-[0.18em] uppercase font-semibold border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors`}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
