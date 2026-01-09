import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/usePortfolioData';
import { ProjectModal } from '@/components/ui/ProjectModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function ProjectsSection() {
  const { data: projects, isLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<typeof projects extends (infer T)[] ? T : never | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: NonNullable<typeof projects>[number]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="section-wrapper relative">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="Projects" subtitle="Featured work and side projects" />
        
        {/* Horizontal scrollable container */}
        <motion.div 
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin -mx-4 px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[320px] skeleton h-72 rounded-xl snap-start" />
            ))
          ) : (
            projects?.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className="flex-shrink-0 w-[320px] group glass-card overflow-hidden relative snap-start cursor-pointer"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleProjectClick(project)}
              >
                {/* Image container */}
                <div className="aspect-[16/10] bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  {project.cover_image_url ? (
                    <img 
                      src={project.cover_image_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-display font-bold text-primary/30">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">Click to view details</span>
                  </div>

                  {project.is_featured && (
                    <span className="absolute top-2 right-2 tag tag-primary text-xs">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-display font-semibold group-hover:text-primary transition-colors flex items-center gap-1">
                    {project.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.short_description}
                  </p>
                  
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="tag text-xs py-0.5 px-2">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="tag text-xs py-0.5 px-2">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
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
