import { motion } from 'framer-motion';
import { TrendingUp, Code, BarChart3, Wrench } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSkillsWithCategories } from '@/hooks/usePortfolioData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, Code, BarChart3, Wrench,
};

export function SkillsSection() {
  const { data: categories, isLoading } = useSkillsWithCategories();

  return (
    <section id="skills" className="section-wrapper">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Skills" subtitle="Technologies and competencies I work with" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="glass-card p-6 card-hover"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-semibold">{category.name}</h3>
                  </div>
                  <div className="space-y-4">
                    {category.skills?.map((skill, skillIndex) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="skill-bar">
                          <motion.div
                            className="skill-bar-fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: catIndex * 0.1 + skillIndex * 0.05, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
