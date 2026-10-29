import type { Variants, Transition } from "motion/react";

export const SANCTUARY_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const SANCTUARY_SPRING: Transition = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.9,
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const editorialFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: SANCTUARY_EASE,
    },
  },
};

export const maskLineReveal: Variants = {
  hidden: { y: "105%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.82,
      ease: SANCTUARY_EASE,
    },
  },
};

export const panelCrossfade: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: SANCTUARY_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.28,
      ease: SANCTUARY_EASE,
    },
  },
};

export const mobileDrawerVariants: Variants = {
  closed: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.25,
      ease: SANCTUARY_EASE,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: SANCTUARY_EASE,
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

export const mobileLinkItem: Variants = {
  closed: { opacity: 0, x: -12 },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.38,
      ease: SANCTUARY_EASE,
    },
  },
};
