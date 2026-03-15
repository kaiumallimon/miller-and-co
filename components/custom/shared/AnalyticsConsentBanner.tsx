"use client";

import { useEffect, useMemo, useState } from "react";
import { bodyFont } from "@/lib/typographies";

type ConsentState = "granted" | "denied" | "unknown";

const STORAGE_KEY = "analytics_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag(gaId: string) {
  if (typeof window === "undefined") return;

  if (!window.dataLayer) window.dataLayer = [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }

  if (!document.querySelector(`script[data-ga='${gaId}']`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.setAttribute("data-ga", gaId);
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", gaId, { anonymize_ip: true });
}

export default function AnalyticsConsentBanner() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const [consent, setConsent] = useState<ConsentState>("unknown");

  useEffect(() => {
    if (!enabled) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "granted" || saved === "denied") {
      setConsent(saved);
      if (saved === "granted" && gaId) {
        ensureGtag(gaId);
      }
      return;
    }

    setConsent("unknown");
  }, [enabled, gaId]);

  const showBanner = useMemo(
    () => enabled && consent === "unknown",
    [enabled, consent]
  );

  if (!enabled) return null;

  return showBanner ? (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-xl border border-white/15 bg-[#141414] text-white p-4 shadow-xl">
      <p className={`${bodyFont.className} text-sm text-white/75 leading-relaxed`}>
        We use analytics cookies to improve website performance and user experience. You can accept or decline analytics tracking.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "denied");
            setConsent("denied");
          }}
          className={`${bodyFont.className} px-4 py-2 text-[11px] tracking-[0.16em] uppercase border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors`}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "granted");
            setConsent("granted");
            if (gaId) ensureGtag(gaId);
          }}
          className={`${bodyFont.className} px-4 py-2 text-[11px] tracking-[0.16em] uppercase bg-[#c8a96e] text-[#1a1a1a] font-semibold hover:opacity-90 transition-opacity`}
        >
          Accept
        </button>
      </div>
    </div>
  ) : null;
}
