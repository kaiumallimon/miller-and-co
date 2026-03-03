"use client";

import { motion, useInView, Variants } from "motion/react";
import { useRef, ReactNode, ElementType } from "react";

// ─── Shared easing ────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── AnimateIn ────────────────────────────────────────────────────────────────
// Single element that fades / slides in when it enters the viewport.

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  as?: ElementType;
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  duration = 0.65,
  direction = "up",
  distance = 28,
  once = true,
  as: Tag = "div",
}: AnimateInProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: "-80px 0px",
  });

  const offset =
    direction === "up"
      ? { y: distance }
      : direction === "down"
      ? { y: -distance }
      : direction === "left"
      ? { x: distance }
      : direction === "right"
      ? { x: -distance }
      : {};

  const MotionTag = motion.create(Tag as "div");

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offset }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...offset }
      }
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

// ─── StaggerContainer ─────────────────────────────────────────────────────────
// Wrapper that orchestrates staggered entrance of its StaggerItem children.

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  as?: ElementType;
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.11,
  delayChildren = 0,
  once = true,
  as: Tag = "div",
}: StaggerContainerProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: "-80px 0px",
  });

  const MotionTag = motion.create(Tag as "div");

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
    <MotionTag
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}

// ─── StaggerItem ──────────────────────────────────────────────────────────────
// Must be a direct child of StaggerContainer.

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  as?: ElementType;
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  distance = 24,
  duration = 0.65,
  as: Tag = "div",
}: StaggerItemProps) {
  const offset =
    direction === "up"
      ? { y: distance }
      : direction === "down"
      ? { y: -distance }
      : direction === "left"
      ? { x: distance }
      : direction === "right"
      ? { x: -distance }
      : {};

  const MotionTag = motion.create(Tag as "div");

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
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
