import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reduced to 800ms for faster perceived load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-background flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-2xl font-display font-bold text-primary-foreground">
                PS
              </span>
            </motion.div>
            <motion.div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
