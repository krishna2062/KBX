import { useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

interface ScrollRevealOptions {
  once?: boolean;
  amount?: 'some' | 'all' | number;
  margin?: string;
}

/**
 * Custom hook using Framer Motion to detect when a section enters viewport
 * and triggers a cinematic subtle upward fade-in, respecting user's reduced-motion settings.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const isInView = useInView(ref, {
    once: options.once ?? true,
    amount: options.amount ?? 0.15,
    // Cast margin if provided
    margin: options.margin as any,
  });

  // If user prefers reduced motion, always return active state with 0 displacement
  const active = shouldReduceMotion ? true : isInView;

  return {
    ref,
    isInView: active,
    shouldReduceMotion: Boolean(shouldReduceMotion),
    motionProps: {
      initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
      animate: active ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier settling curve
      },
    },
  };
}
