import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Code, Users, Award, Trophy, Star, Target, Zap } from 'lucide-react';
import { useSectionSettings } from '@/hooks/usePortfolioData';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  Code,
  Users,
  Award,
  Trophy,
  Star,
  Target,
  Zap,
};

interface Stat {
  id: string;
  icon: string;
  value: number;
  suffix: string;
  label: string;
  ordering: number;
  is_active: boolean;
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-display font-bold text-primary">
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const { data: stats, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const result = await supabase
        .from('stats')
        .select('*')
        .eq('is_active', true)
        .order('ordering') as unknown as { data: Stat[] | null; error: any };

      if (result.error) throw result.error;
      return result.data || [];
    },
    retry: 2,
    refetchOnWindowFocus: true,
  });

  const [cachedStats, setCachedStats] = useState<Stat[] | null>(null);

  useEffect(() => {
    if (stats && stats.length > 0) {
      setCachedStats(stats);
    }
  }, [stats]);

  useEffect(() => {
    if (isError) {
      console.warn('[StatsSection] stats query error:', error);
    }
  }, [isError, error]);

  const { data: sections } = useSectionSettings();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Check if stats section is visible
  const statsSection = sections?.find((s) => s.section_key === 'stats');
  if (statsSection && !statsSection.is_visible) return null;

  const visibleStats = stats && stats.length > 0 ? stats : cachedStats;

  if ((isLoading || isFetching) && !visibleStats) {
    return (
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!visibleStats || visibleStats.length === 0) return null;

  return (
    <section id="stats" className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {visibleStats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Briefcase;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors"
                >
                  <IconComponent className="h-6 w-6 text-primary" />
                </motion.div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <span className="text-muted-foreground text-sm mt-2">{stat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
