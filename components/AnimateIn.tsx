"use client";

import { motion, useInView, Variants } from "motion/react";
import { useRef, ReactNode } from "react";
import { usePreloaderReady } from "@/components/PreloaderContext";

// ─── Shared easing ────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

// Resolve initial offset from direction
function directionOffset(
  direction: "up" | "down" | "left" | "right" | "none",
  distance: number
): { x?: number; y?: number } {
  if (direction === "up") return { y: distance };
  if (direction === "down") return { y: -distance };
  if (direction === "left") return { x: distance };
  if (direction === "right") return { x: -distance };
  return {};
}

// ─── AnimateIn ────────────────────────────────────────────────────────────────
interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  duration = 0.65,
  direction = "up",
  distance = 28,
  once = true,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { ready } = usePreloaderReady();
  const isInView = useInView(ref, { once, margin: "-80px 0px" });
  const offset = directionOffset(direction, distance);
  const shouldAnimate = ready && isInView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={shouldAnimate ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerContainer ─────────────────────────────────────────────────────────
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.11,
  delayChildren = 0,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { ready } = usePreloaderReady();
  const isInView = useInView(ref, { once, margin: "-80px 0px" });
  const shouldAnimate = ready && isInView;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerItem ──────────────────────────────────────────────────────────────
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  distance = 24,
  duration = 0.65,
}: StaggerItemProps) {
  const offset = directionOffset(direction, distance);

  const itemVariants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: EASE },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
