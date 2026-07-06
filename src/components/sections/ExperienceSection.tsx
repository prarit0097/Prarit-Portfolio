import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useExperiences } from '@/hooks/usePortfolioData';
import { format } from 'date-fns';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getAnimationVariants, viewportConfig } from '@/lib/animations';

export function ExperienceSection() {
  const { data: experiences, isLoading } = useExperiences();
  const { shouldReduceMotion } = useReducedMotion();
  const variants = getAnimationVariants(shouldReduceMotion);

  const formatDate = (date: string) => format(new Date(date), 'MMM yyyy');

  return (
    <section id="experience" className="section-wrapper bg-muted/30 relative overflow-hidden">
      {/* Only show animated background on high-performance devices */}
      {!shouldReduceMotion && <AnimatedBackground variant="waves" />}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading eyebrow="Career" title="Experience" subtitle="My professional journey" />
        
        <motion.div 
          className="max-w-3xl mx-auto"
          variants={variants.container}
          initial="hidden"
          {...(shouldReduceMotion 
            ? { animate: "visible" } 
            : { whileInView: "visible", viewport: viewportConfig }
          )}
        >
          <div className="relative">
            {/* Static timeline line for performance - no animation */}
            <div 
              className="timeline-line ml-4 md:ml-0 md:left-1/2 md:-translate-x-px"
            />
            
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-xl mb-8" />
              ))
            ) : (
              experiences?.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  variants={variants.item}
                  className="relative pl-12 md:pl-0 mb-12 last:mb-0"
                >
                  {/* Static timeline dot */}
                  <div className="timeline-dot md:left-1/2 md:-translate-x-1/2" />
                  
                  <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="glass-card p-6 group hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-300">
                      {/* Hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-xl font-display font-semibold group-hover:translate-x-1 transition-transform">
                              {exp.role}
                            </h3>
                            <p className="text-primary font-medium">{exp.company}</p>
                          </div>
                          {exp.is_current && (
                            <span className="tag tag-primary">
                              Current
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
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
                        </div>
                        
                        {exp.description && (
                          <p className="text-muted-foreground mb-4">{exp.description}</p>
                        )}
                        
                        {exp.achievements && exp.achievements.length > 0 && (
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <li 
                                key={i} 
                                className="flex items-start gap-2 text-sm group/item"
                              >
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
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
