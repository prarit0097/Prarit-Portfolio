import { motion } from 'framer-motion';
import { 
  Code, TrendingUp, Database, Smartphone, Globe, Zap,
  Briefcase, BarChart, Settings, Rocket, Target, Users, LucideIcon
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useServices } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';
import { getAnimationVariants, viewportConfig } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const iconMap: Record<string, LucideIcon> = {
  Code, TrendingUp, Database, Smartphone, Globe, Zap,
  Briefcase, BarChart, Settings, Rocket, Target, Users,
};

export function ServicesSection() {
  const { data: services, isLoading } = useServices();
  const { shouldReduceMotion } = useReducedMotion();
  const variants = getAnimationVariants(shouldReduceMotion);

  if (isLoading) {
    return (
      <section id="services" className="section-wrapper">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            title="What I Do" 
            subtitle="Services I offer to help you achieve your goals" 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="section-wrapper relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading 
          title="What I Do" 
          subtitle="Services I offer to help you achieve your goals" 
        />

        <motion.div
          variants={variants.container}
          initial="hidden"
          {...(shouldReduceMotion 
            ? { animate: "visible" } 
            : { whileInView: "visible", viewport: viewportConfig }
          )}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon || ''] || Zap;
            
            return (
              <motion.div
                key={service.id}
                variants={variants.card}
                className="group glass-card p-4 md:p-6 relative overflow-hidden"
              >
                <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                  <IconComponent className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-display font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <span className="absolute top-4 right-4 text-6xl font-bold text-primary/5">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
