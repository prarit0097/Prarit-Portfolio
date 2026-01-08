import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/usePortfolioData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6 },
  },
};

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();

  return (
    <section id="projects" className="section-wrapper relative">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Projects" subtitle="Featured work and side projects" />
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-xl" />
            ))
          ) : (
            projects?.map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className="group glass-card overflow-hidden relative"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Image container with overlay */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  {project.cover_image_url ? (
                    <motion.img 
                      src={project.cover_image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <motion.div 
                      className="w-full h-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-4xl font-display font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </span>
                    </motion.div>
                  )}
                  
                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4"
                  >
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      className="flex gap-2"
                    >
                      {project.github_url && (
                        <motion.a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button size="sm" variant="secondary" className="h-8 px-3">
                            <Github className="h-4 w-4" />
                          </Button>
                        </motion.a>
                      )}
                      {project.live_url && (
                        <motion.a 
                          href={project.live_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button size="sm" className="h-8 px-3">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </motion.a>
                      )}
                    </motion.div>
                  </motion.div>

                  {project.is_featured && (
                    <motion.span 
                      className="absolute top-3 right-3 tag tag-primary"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      Featured
                    </motion.span>
                  )}
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <motion.h3 
                      className="text-xl font-display font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2"
                    >
                      {project.title}
                      <motion.span
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </motion.span>
                    </motion.h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.short_description}
                    </p>
                  </div>
                  
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        visible: { transition: { staggerChildren: 0.05 } }
                      }}
                    >
                      {project.tech_stack.slice(0, 4).map((tech, i) => (
                        <motion.span 
                          key={tech} 
                          className="tag text-xs"
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1 }
                          }}
                          whileHover={{ scale: 1.1, y: -2 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <motion.span 
                          className="tag text-xs"
                          whileHover={{ scale: 1.1 }}
                        >
                          +{project.tech_stack.length - 4}
                        </motion.span>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
