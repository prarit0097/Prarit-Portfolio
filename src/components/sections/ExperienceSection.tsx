import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useExperiences } from '@/hooks/usePortfolioData';
import { format } from 'date-fns';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ExperienceSection() {
  const { data: experiences, isLoading } = useExperiences();

  const formatDate = (date: string) => format(new Date(date), 'MMM yyyy');

  return (
    <section id="experience" className="section-wrapper bg-muted/30 relative overflow-hidden">
      <AnimatedBackground variant="waves" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading title="Experience" subtitle="My professional journey" />
        
        <motion.div 
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative">
            {/* Animated timeline line */}
            <motion.div 
              className="timeline-line ml-4 md:ml-0 md:left-1/2 md:-translate-x-px"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ transformOrigin: 'top' }}
            />
            
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-xl mb-8" />
              ))
            ) : (
              experiences?.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  variants={{
                    hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.6 },
                    },
                  }}
                  className="relative pl-12 md:pl-0 mb-12 last:mb-0"
                >
                  {/* Animated timeline dot */}
                  <motion.div 
                    className="timeline-dot md:left-1/2 md:-translate-x-1/2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.5 }}
                  />
                  
                  <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <motion.div 
                      className="glass-card p-6 group"
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Hover gradient */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      
                      <div className="relative z-10">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <motion.h3 
                              className="text-xl font-display font-semibold"
                              whileHover={{ x: 5 }}
                            >
                              {exp.role}
                            </motion.h3>
                            <p className="text-primary font-medium">{exp.company}</p>
                          </div>
                          {exp.is_current && (
                            <motion.span 
                              className="tag tag-primary"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Current
                            </motion.span>
                          )}
                        </div>
                        
                        <motion.div 
                          className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : exp.end_date && formatDate(exp.end_date)}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {exp.location}
                            </span>
                          )}
                        </motion.div>
                        
                        {exp.description && (
                          <p className="text-muted-foreground mb-4">{exp.description}</p>
                        )}
                        
                        {exp.achievements && exp.achievements.length > 0 && (
                          <motion.ul 
                            className="space-y-2"
                            variants={{
                              visible: { transition: { staggerChildren: 0.1 } }
                            }}
                          >
                            {exp.achievements.map((achievement, i) => (
                              <motion.li 
                                key={i} 
                                className="flex items-start gap-2 text-sm"
                                variants={{
                                  hidden: { opacity: 0, x: -10 },
                                  visible: { opacity: 1, x: 0 }
                                }}
                                whileHover={{ x: 5 }}
                              >
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                </motion.div>
                                <span>{achievement}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
