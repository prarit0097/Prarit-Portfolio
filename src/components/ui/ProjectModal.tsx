import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Project {
  id: string;
  title: string;
  short_description?: string | null;
  full_description?: string | null;
  cover_image_url?: string | null;
  tech_stack?: string[] | null;
  github_url?: string | null;
  live_url?: string | null;
  category?: string | null;
  is_featured?: boolean | null;
  created_at?: string | null;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Cover Image */}
        <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
          {project.cover_image_url ? (
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-display font-bold text-primary/30">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
          
          {project.is_featured && (
            <span className="absolute top-4 left-4 tag tag-primary">
              Featured
            </span>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-2xl md:text-3xl font-display font-bold">
                {project.title}
              </DialogTitle>
            </div>
            
            {project.category && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span className="text-sm">{project.category}</span>
              </div>
            )}
          </DialogHeader>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {project.full_description || project.short_description || 'No description available.'}
            </p>
          </div>

          {/* Tech Stack */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Live Demo
                </Button>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Github className="h-4 w-4" />
                  View Source Code
                </Button>
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
