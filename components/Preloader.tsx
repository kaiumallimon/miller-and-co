"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { bodyFont } from "@/lib/typographies";
import { usePreloaderReady } from "@/components/PreloaderContext";

const SMOOTH = [0.22, 1, 0.36, 1] as const;
const SHARP  = [0.76, 0, 0.24, 1] as const;

// This component is always loaded with ssr:false, so sessionStorage is safe
// to read in the lazy initializer — it only ever runs in the browser.
export default function Preloader() {
  const [visible, setVisible] = useState(
    () => sessionStorage.getItem("preloader_seen") !== "1"
  );
  const { setReady } = usePreloaderReady();

  useEffect(() => {
    if (!visible) {
      // Already seen this session — unlock animations immediately
      setReady();
      return;
    }

    // Preloader is now mounted and covering the page — safe to un-hide
    document.documentElement.style.visibility = "";
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      sessionStorage.setItem("preloader_seen", "1");
      setReady();
      setVisible(false);
      document.body.style.overflow = "";
    }, 2600);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-300 flex items-center justify-center bg-[#111111] overflow-hidden"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: SHARP, delay: 0.1 }}
        >

          {/* Corner accents — top-left */}
          <motion.span
            className="absolute top-8 left-8 w-12 h-12 border-t border-l border-[#c8a96e]/25"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: SMOOTH }}
          />
          {/* Corner accents — bottom-right */}
          <motion.span
            className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-[#c8a96e]/25"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: SMOOTH }}
          />

          {/* Center content */}
          <div className="flex flex-col items-center gap-7 select-none">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.25, ease: SMOOTH }}
            >
              <Image
                src="/NEW-logo-TM-White1.png"
                alt="Miller & Co"
                width={190}
                height={50}
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Progress bar track */}
            <div className="w-40 h-px bg-white/8 overflow-hidden">
              <motion.div
                className="h-full bg-[#c8a96e]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ originX: 0 }}
                transition={{ duration: 1.4, delay: 0.55, ease: SMOOTH }}
              />
            </div>

            {/* Tagline */}
            <motion.p
              className={`${bodyFont.className} text-white/30 text-[9px] tracking-[0.2em] uppercase`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease: SMOOTH }}
            >
              Sydney&apos;s Trusted Migration Law Firm
            </motion.p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
