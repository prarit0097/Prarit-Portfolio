import { Variants } from 'framer-motion';

// Synchronized animation variants for consistent experience across all sections

// Full animations (default)
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.25,
    },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
    },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

// Reduced motion variants (for accessibility/performance)
export const reducedContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
};

export const reducedItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
};

export const reducedCardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
};

// Viewport settings for whileInView
export const viewportConfig = {
  once: true,
  margin: "200px 0px 200px 0px" as const,
  amount: 0.01 as const,
};

// For section headings
export const headingVariants = {
  title: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25 },
    },
  } as Variants,
  subtitle: {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, delay: 0.05 },
    },
  } as Variants,
  line: {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.3, delay: 0.1 },
    },
  } as Variants,
};

// Reduced motion heading variants
export const reducedHeadingVariants = {
  title: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.1 },
    },
  } as Variants,
  subtitle: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.1 },
    },
  } as Variants,
  line: {
    hidden: { scaleX: 1 },
    visible: {
      scaleX: 1,
      transition: { duration: 0 },
    },
  } as Variants,
};

// Helper to get appropriate variants based on reduced motion preference
export function getAnimationVariants(shouldReduceMotion: boolean) {
  return {
    container: shouldReduceMotion ? reducedContainerVariants : containerVariants,
    item: shouldReduceMotion ? reducedItemVariants : itemVariants,
    card: shouldReduceMotion ? reducedCardVariants : cardVariants,
    heading: shouldReduceMotion ? reducedHeadingVariants : headingVariants,
  };
}
