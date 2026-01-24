import { motion } from 'framer-motion';
import { TrendingUp, Code, BarChart3, Wrench } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSkillsWithCategories } from '@/hooks/usePortfolioData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, Code, BarChart3, Wrench,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export function SkillsSection() {
  const { data: categories, isLoading } = useSkillsWithCategories();

  return (
    <section id="skills" className="section-wrapper relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading title="Skills" subtitle="Technologies and competencies I work with" />
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
                  variants={cardVariants}
                  className="glass-card p-4 md:p-6 group relative overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Hover gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                      <motion.div 
                        className="p-1.5 md:p-2 rounded-lg bg-primary/10"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </motion.div>
                      <h3 className="text-lg md:text-xl font-display font-semibold">{category.name}</h3>
                    </div>
                    <div className="space-y-4">
                      {category.skills?.map((skill, skillIndex) => (
                        <motion.div 
                          key={skill.id} 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: catIndex * 0.1 + skillIndex * 0.05 }}
                        >
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <motion.span 
                              className="text-muted-foreground"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: catIndex * 0.1 + skillIndex * 0.05 + 0.3 }}
                            >
                              {skill.level}%
                            </motion.span>
                          </div>
                          <div className="skill-bar overflow-hidden">
                            <motion.div
                              className="skill-bar-fill relative"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ 
                                delay: catIndex * 0.1 + skillIndex * 0.08, 
                                duration: 1,
                                ease: [0.22, 1, 0.36, 1]
                              }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ 
                                  duration: 1.5, 
                                  repeat: Infinity, 
                                  repeatDelay: 2,
                                  ease: "linear" 
                                }}
                              />
                            </motion.div>
                          </div>
                        </motion.div>
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
