import { motion } from 'framer-motion';
import { TrendingUp, Code, BarChart3, Wrench } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSkillsWithCategories } from '@/hooks/usePortfolioData';
import { getAnimationVariants, viewportConfig } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, Code, BarChart3, Wrench,
};

export function SkillsSection() {
  const { data: categories, isLoading } = useSkillsWithCategories();
  const { shouldReduceMotion } = useReducedMotion();
  const variants = getAnimationVariants(shouldReduceMotion);

  return (
    <section id="skills" className="section-wrapper relative overflow-hidden">
      {!shouldReduceMotion && (
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading title="Skills" subtitle="Technologies and competencies I work with" />
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto"
          variants={variants.container}
          initial="hidden"
          {...(shouldReduceMotion 
            ? { animate: "visible" } 
            : { whileInView: "visible", viewport: viewportConfig }
          )}
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-xl" />
            ))
          ) : (
            categories?.map((category, catIndex) => {
              const Icon = iconMap[category.icon || 'Code'] || Code;
              return (
                <motion.div
                  key={category.id}
                  variants={variants.card}
                  className="glass-card p-4 md:p-6 group relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                      <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <h3 className="text-lg md:text-xl font-display font-semibold">{category.name}</h3>
                    </div>
                    <div className="space-y-4">
                      {category.skills?.map((skill, skillIndex) => (
                        <div key={skill.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="skill-bar overflow-hidden">
                            <motion.div
                              className="skill-bar-fill relative"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ 
                                delay: shouldReduceMotion ? 0 : skillIndex * 0.05, 
                                duration: shouldReduceMotion ? 0.1 : 0.5,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
}
