import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useExperiences } from '@/hooks/usePortfolioData';
import { format } from 'date-fns';

export function ExperienceSection() {
  const { data: experiences, isLoading } = useExperiences();

  const formatDate = (date: string) => format(new Date(date), 'MMM yyyy');

  return (
    <section id="experience" className="section-wrapper bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Experience" subtitle="My professional journey" />
        
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="timeline-line ml-4 md:ml-0 md:left-1/2 md:-translate-x-px" />
            
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-xl mb-8" />
              ))
            ) : (
              experiences?.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12 md:pl-0 mb-12 last:mb-0"
                >
                  <div className="timeline-dot md:left-1/2 md:-translate-x-1/2" />
                  
                  <div className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="glass-card p-6 card-hover">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                        <div>
                          <h3 className="text-xl font-display font-semibold">{exp.role}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                        </div>
                        {exp.is_current && (
                          <span className="tag tag-primary">Current</span>
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
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Briefcase className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
