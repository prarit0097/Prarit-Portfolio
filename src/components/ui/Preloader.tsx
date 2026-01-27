import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const { shouldReduceMotion } = useReducedMotion();

  useEffect(() => {
    // Faster on mobile/low-end devices, 600ms otherwise
    const duration = shouldReduceMotion ? 300 : 600;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  // Skip preloader entirely on mobile for faster load
  if (shouldReduceMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-background flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-primary-foreground">
                PS
              </span>
            </div>
            <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
