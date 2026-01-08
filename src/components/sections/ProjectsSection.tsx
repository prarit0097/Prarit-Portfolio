import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/usePortfolioData';

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();

  return (
    <section id="projects" className="section-wrapper">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Projects" subtitle="Featured work and side projects" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-xl" />
            ))
          ) : (
            projects?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group glass-card overflow-hidden card-hover"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  {project.cover_image_url ? (
                    <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-display font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {project.is_featured && (
                    <span className="absolute top-3 right-3 tag tag-primary">Featured</span>
                  )}
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.short_description}
                    </p>
                  </div>
                  
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span key={tech} className="tag text-xs">{tech}</span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="tag text-xs">+{project.tech_stack.length - 4}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 pt-2">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-8 px-3">
                          <Github className="h-4 w-4 mr-1" /> Code
                        </Button>
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-8 px-3">
                          <ExternalLink className="h-4 w-4 mr-1" /> Live
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
