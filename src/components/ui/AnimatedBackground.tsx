import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedBackgroundProps {
  variant?: 'waves' | 'grid' | 'gradient-orbs';
  className?: string;
}

// Static CSS-only backgrounds for better performance
export function AnimatedBackground({ variant = 'waves', className = '' }: AnimatedBackgroundProps) {
  const { shouldReduceMotion } = useReducedMotion();

  // Always use static backgrounds - no framer-motion animations
  if (variant === 'waves') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <svg
          className="absolute bottom-0 left-0 w-full h-32 md:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="hsl(var(--primary) / 0.03)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill="hsl(var(--primary) / 0.02)"
            d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,218.7C672,192,768,160,864,165.3C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'grid') {
    // Skip grid pattern on mobile for performance
    if (shouldReduceMotion) return null;
    
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>
    );
  }

  if (variant === 'gradient-orbs') {
    // Simple static gradient - no animations
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div
          className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
            top: '10%',
            left: '10%',
          }}
        />
        <div
          className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.2) 0%, transparent 70%)',
            bottom: '20%',
            right: '10%',
          }}
        />
      </div>
    );
  }

  return null;
}
