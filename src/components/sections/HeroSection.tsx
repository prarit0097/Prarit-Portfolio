import { motion } from 'framer-motion';
import { Download, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileSettings, useSectionSettings } from '@/hooks/usePortfolioData';
import { TypeWriter } from '@/components/ui/TypeWriter';
import { FloatingParticles } from '@/components/ui/FloatingParticles';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getAnimationVariants } from '@/lib/animations';

export function HeroSection() {
  const { data: profile, isLoading } = useProfileSettings();
  const { data: sectionSettings, isLoading: isSectionsLoading } = useSectionSettings();
  const { shouldReduceMotion } = useReducedMotion();
  const variants = getAnimationVariants(shouldReduceMotion);

  const isProjectsVisible = isSectionsLoading || !sectionSettings
    ? true
    : (sectionSettings.find((s) => s.section_key === 'projects')?.is_visible ?? true);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-8 md:pt-20 md:pb-0"
      aria-label="Introduction"
      itemScope 
      itemType="https://schema.org/Person"
    >
      {/* Floating Particles Background - only show if not reduced motion */}
      {!shouldReduceMotion && <FloatingParticles />}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          variants={variants.container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
        >
          <motion.div variants={variants.item} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <span className="text-primary font-medium text-xs md:text-sm tracking-wide">
                Hello, I'm
              </span>
            </div>
            <h1 
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight"
              itemProp="name"
            >
              {isLoading ? (
                <span className="skeleton inline-block h-20 w-80 rounded" />
              ) : (
                <span className="inline-block">
                  {profile?.name || 'Prarit Sidana'}
                </span>
              )}
            </h1>
            <motion.div 
              variants={variants.item}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance h-7 md:h-8"
            >
              {isLoading ? (
                <span className="skeleton inline-block h-8 w-96 rounded" />
              ) : shouldReduceMotion ? (
                <span>{profile?.tagline || 'Sales Head & Python Developer'}</span>
              ) : (
                <TypeWriter
                  words={[
                    profile?.tagline || 'Sales Head & Python Developer',
                    'Building Digital Experiences',
                    'Turning Ideas into Reality',
                    'Creative Problem Solver',
                  ]}
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseDuration={2500}
                />
              )}
            </motion.div>
          </motion.div>

          <motion.div
            variants={variants.item}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 md:gap-4"
          >
            {isProjectsVisible && (
              <a href="#projects">
                <Button className="btn-primary h-11 md:h-12 px-6 md:px-8 text-sm md:text-base group w-full sm:w-auto">
                  <span>View Projects</span>
                  {!shouldReduceMotion && (
                    <motion.span
                      className="ml-2 inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  )}
                  {shouldReduceMotion && <span className="ml-2">→</span>}
                </Button>
              </a>
            )}
            {profile?.resume_url && (
              <a 
                href={profile.resume_url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="btn-ghost h-11 md:h-12 px-6 md:px-8 text-sm md:text-base w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </a>
            )}
            <a href="#contact" className="w-full sm:w-auto">
              <Button variant="outline" className="btn-ghost h-11 md:h-12 px-6 md:px-8 text-sm md:text-base w-full sm:w-auto">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </a>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
