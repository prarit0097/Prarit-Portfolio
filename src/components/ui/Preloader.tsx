import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const { shouldReduceMotion } = useReducedMotion();

  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem('preloader-seen') === 'true';
    const duration = hasSeenPreloader || shouldReduceMotion ? 0 : 180;

    const timer = setTimeout(() => {
      sessionStorage.setItem('preloader-seen', 'true');
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  // Skip preloader entirely for reduced-motion or after first brief view
  if (shouldReduceMotion || !isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[200] bg-background flex items-center justify-center pointer-events-none"
      >
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </motion.div>
    </AnimatePresence>
  );
}
