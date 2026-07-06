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
      className="relative min-h-[82vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-8 md:pt-28 md:pb-10"
      aria-label="Introduction"
      itemScope
      itemType="https://schema.org/Person"
    >
      {!shouldReduceMotion && <FloatingParticles />}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          variants={variants.container}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center"
        >
          <div className="text-center lg:text-left space-y-6 md:space-y-8">
            <motion.div variants={variants.item} className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-background/70 border border-primary/20 shadow-soft">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                <span className="text-primary font-medium text-xs md:text-sm tracking-wide">
                  Business x Technology
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-display font-bold tracking-tight leading-[0.94]"
                itemProp="name"
              >
                {isLoading ? (
                  <span className="skeleton inline-block h-20 w-80 rounded" />
                ) : (
                  <span
                    className="inline-block bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text"
                    style={{ WebkitTextFillColor: 'transparent' }}
                  >
                    {profile?.name || 'Prarit Sidana'}
                  </span>
                )}
              </h1>

              <motion.div
                variants={variants.item}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl lg:max-w-xl mx-auto lg:mx-0 text-balance h-7 md:h-8"
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

              <motion.p
                variants={variants.item}
                className="text-sm md:text-base text-muted-foreground/90 max-w-2xl lg:max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                Building polished digital systems, sharp business workflows, and trustworthy user experiences with a practical operator mindset.
              </motion.p>
            </motion.div>

            <motion.div
              variants={variants.item}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4"
            >
              {isProjectsVisible && (
                <a href="#projects">
                  <Button className="btn-primary h-11 md:h-12 px-6 md:px-8 text-sm md:text-base group w-full sm:w-auto">
                    <span>View Projects</span>
                    <span className="ml-2">→</span>
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
          </div>

          <motion.div variants={variants.item} className="hidden lg:block">
            <div className="glass-card p-8 lg:p-10">
              <div className="space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">Overview</p>
                  <p className="text-3xl font-display font-semibold leading-tight">
                    Sales leadership meets hands-on engineering.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-[1.25rem] border border-border/70 bg-background/55 p-5">
                    <p className="text-3xl font-display font-bold">Business</p>
                    <p className="text-sm text-muted-foreground mt-2">Sales strategy, fintech growth, and revenue operations.</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-border/70 bg-background/55 p-5">
                    <p className="text-3xl font-display font-bold">Code</p>
                    <p className="text-sm text-muted-foreground mt-2">Python, Django, and AI systems shipped to production.</p>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-primary/15 bg-primary/10 p-5">
                  <p className="text-xs uppercase tracking-[0.26em] text-primary font-semibold mb-2">Current Focus</p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Building AI-driven products — social media automation, AI revenue operations, and market prediction platforms.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
