import { memo } from 'react';

// Simplified static background - no framer-motion for maximum performance
export const FloatingParticles = memo(function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static glowing orbs only - no animations */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl" />
    </div>
  );
});
