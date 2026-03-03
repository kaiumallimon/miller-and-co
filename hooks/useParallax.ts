"use client";

import { useRef } from "react";
import { useScroll, useTransform, MotionValue } from "motion/react";

interface UseParallaxReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
}

/**
 * Tracks when the referenced element scrolls through the viewport and
 * returns a MotionValue<number> that goes from -speed → +speed.
 * Apply it to a motion.div whose top/bottom inset is expanded by `speed`px
 * so the image never shows a gap at the edges.
 */
export function useParallax(speed = 50): UseParallaxReturn {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  return { ref, y };
}
