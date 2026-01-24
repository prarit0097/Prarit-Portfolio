import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4, // Bigger particles (4-12px)
    duration: Math.random() * 8 + 10,
    delay: Math.random() * 3,
  }));
}

export const FloatingParticles = memo(function FloatingParticles() {
  const particles = useMemo(() => generateParticles(30), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/50 shadow-lg shadow-primary/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Larger glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/25 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/35 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 10,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
});
