import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useProjects } from '@/hooks/usePortfolioData';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getAnimationVariants, viewportConfig } from '@/lib/animations';

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<typeof projects extends (infer T)[] ? T : never | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { shouldReduceMotion } = useReducedMotion();
  const variants = getAnimationVariants(shouldReduceMotion);

  const handleProjectClick = (project: NonNullable<typeof projects>[number]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // If there are no projects, don't render an empty section (avoids "blank space")
  if (!isLoading && (!projects || projects.length === 0)) {
    return null;
  }

  return (
    <section id="projects" className="section-wrapper relative">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading eyebrow="Selected Work" title="Projects" subtitle="Products and platforms I've built — from SaaS to AI systems" />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto"
          variants={variants.container}
          initial="hidden"
          {...(shouldReduceMotion
            ? { animate: "visible" }
            : { whileInView: "visible", viewport: viewportConfig }
          )}
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-[1.5rem]" />
            ))
          ) : (
            projects?.map((project) => (
              <motion.article
                key={project.id}
                variants={variants.card}
                className="group glass-card overflow-hidden relative cursor-pointer flex flex-col hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[var(--shadow-glow)]"
                onClick={() => handleProjectClick(project)}
              >
                {/* Image container */}
                <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-display font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {project.is_featured && (
                    <span className="absolute top-3 right-3 tag tag-primary text-xs shadow-soft">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-5 md:p-6 flex flex-col flex-1 gap-3">
                  <div className="flex items-center justify-between gap-2">
                    {project.category && (
                      <span className="inline-flex rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {project.category}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} source code on GitHub`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} live site`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-display font-semibold group-hover:text-primary transition-colors flex items-center gap-1">
                    {project.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.short_description}
                  </p>

                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 mt-auto">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span key={tech} className="tag text-xs py-0.5 px-2">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="tag text-xs py-0.5 px-2">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))
          )}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
