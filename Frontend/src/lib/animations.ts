import type { MotionProps } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * fadeIn: Best for UI elements like buttons, badges, or small icons.
 * Movement: A quick, subtle slide up from 16px to 0px.
 */
export const fadeIn = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease },
});

/**
 * heroFadeUp: Specifically for the top Header/Hero section (H1, Subtext).
 * Movement: A slow, premium glide up from 24px to 0px immediately on page load.
 */
export const heroFadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay },
  },
});

/**
 * fadeUp: Use for body sections (Features, Pricing, CTA) as you scroll down.
 * Movement: Slides up when it enters the screen, making the page feel "alive".
 */
export const fadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 24 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease, delay },
  },
  viewport: { once: true, margin: "0px 0px -50px 0px" },
});

/**
 * scaleIn: Perfect for visual cards, testimonials, or image grids.
 * Movement: Fades in while growing slightly from 95% to 100% size.
 */
export const scaleIn = (delay = 0): MotionProps => ({
  initial: { opacity: 0, scale: 0.95 },
  whileInView: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease, delay },
  },
  viewport: { once: true, margin: "0px 0px -50px 0px" },
});

/**
 * staggerContainer: Place on a parent div to control a list of items.
 * Movement: Makes child elements appear one after another in a smooth sequence.
 */
export const staggerContainer = (
  staggerChildren = 0.06,
  delayChildren = 0
): MotionProps => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "0px 0px -50px 0px" },
  variants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren, delayChildren },
    },
  },
});

export const stepAnimation: MotionProps = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};
