import { motion } from 'framer-motion';
import { 
  Code, 
  TrendingUp, 
  Database, 
  Smartphone, 
  Globe, 
  Zap,
  Briefcase,
  BarChart,
  Settings,
  Rocket,
  Target,
  Users,
  LucideIcon
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useServices } from '@/hooks/usePortfolioData';
import { Skeleton } from '@/components/ui/skeleton';

// Map icon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  Code,
  TrendingUp,
  Database,
  Smartphone,
  Globe,
  Zap,
  Briefcase,
  BarChart,
  Settings,
  Rocket,
  Target,
  Users,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function ServicesSection() {
  const { data: services, isLoading } = useServices();

  if (isLoading) {
    return (
      <section id="services" className="section-wrapper">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading 
            title="What I Do" 
            subtitle="Services I offer to help you achieve your goals" 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      {/* Background decoration */}
      <motion.div
        className="absolute top-1/3 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-0 w-60 h-60 bg-accent/5 rounded-full blur-3xl"
        animate={{ scale: [1, 0.9, 1], x: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading 
          title="What I Do" 
          subtitle="Services I offer to help you achieve your goals" 
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon || ''] || Zap;
            
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group glass-card p-6 relative overflow-hidden"
              >
                {/* Hover gradient effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Icon */}
                <motion.div
                  className="relative z-10 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent className="h-7 w-7 text-primary" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Number decoration */}
                <span className="absolute top-4 right-4 text-6xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
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
