"use client";

import { useState } from "react";
import { bodyFont } from "@/lib/typographies";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "61280956369"; // +61 2 8095 6369 in international format
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello! I'd like to enquire about your migration and legal services."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function WhatsAppFab() {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <div
        className={`${bodyFont.className} flex items-center gap-2 bg-[#1a1a1a] text-white text-xs font-medium tracking-wide px-4 py-2.5 shadow-xl whitespace-nowrap transition-all duration-300 ${
          tooltipVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-pulse shrink-0" />
        Chat with us on WhatsApp
        <button
          onClick={() => setTooltipVisible(false)}
          className="ml-1 text-white/40 hover:text-white transition-colors duration-200"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* FAB button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25d366] shadow-lg hover:bg-[#1ebe5d] transition-colors duration-300"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25d366] opacity-30 animate-ping group-hover:opacity-0 transition-opacity duration-300" />

        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="white"
          className="w-7 h-7 relative z-10"
          aria-hidden="true"
        >
          <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.363.627 4.674 1.82 6.7L2.667 29.333l6.8-1.787A13.27 13.27 0 0 0 16.003 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.003 2.667zm0 2.4c5.92 0 10.93 5.013 10.93 10.933s-5.01 10.933-10.93 10.933a10.89 10.89 0 0 1-5.56-1.52l-.4-.24-4.04 1.053 1.08-3.907-.267-.413A10.87 10.87 0 0 1 5.07 16c0-5.92 5.013-10.933 10.933-10.933zm-3.2 5.6c-.267 0-.693.107-.96.4-.267.293-1.04 1.013-1.04 2.48s1.067 2.88 1.213 3.08c.147.2 2.08 3.173 5.04 4.32.707.24 1.253.373 1.68.48.707.173 1.347.147 1.853.093.56-.067 1.733-.707 1.973-1.387.24-.68.24-1.253.173-1.387-.067-.133-.24-.2-.507-.333s-1.573-.773-1.813-.867c-.24-.093-.413-.133-.587.133-.173.267-.667.867-.813 1.04-.147.173-.293.2-.547.067-.267-.133-1.107-.413-2.107-1.307-.773-.693-1.293-1.547-1.44-1.813-.147-.267-.013-.413.12-.547.12-.12.267-.307.4-.467.133-.16.173-.267.267-.44.093-.173.047-.333-.027-.467-.08-.133-.587-1.413-.8-1.933-.213-.507-.44-.44-.587-.44h-.533z" />
        </svg>
      </a>
    </div>
  );
}
