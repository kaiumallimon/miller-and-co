"use client";

import { useState, useEffect } from "react";

interface UseScrollOptions {
  threshold?: number; // Scroll threshold for visibility/state changes
  calculateProgress?: boolean; // Whether to calculate scroll progress percentage
}

interface ScrollState {
  scrollY: number;
  isScrolled: boolean;
  scrollProgress?: number;
}

export function useScroll({
  threshold = 100,
  calculateProgress = false
}: UseScrollOptions = {}): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    isScrolled: false,
    scrollProgress: calculateProgress ? 0 : undefined,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const isScrolled = scrollTop > threshold;

      let scrollProgress: number | undefined;
      if (calculateProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = Math.min((scrollTop / docHeight) * 100, 100);
      }

      setScrollState({
        scrollY: scrollTop,
        isScrolled,
        scrollProgress,
      });
    };

    // Initial call to set state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, calculateProgress]);

  return scrollState;
}