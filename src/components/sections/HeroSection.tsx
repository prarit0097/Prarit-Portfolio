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
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-primary font-medium text-xs md:text-sm tracking-wide">
                  Available for remote roles
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
                      profile?.tagline || 'AI Engineer & Full-Stack Developer',
                      'AI Agents & RAG Pipelines',
                      'Python · Django · React · TypeScript',
                      'I ship production AI systems',
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
                I own production AI features end to end — agentic workflows, RAG pipelines and the infrastructure that runs them. Four production systems shipped, including a paid SaaS and a multi-agent platform with 2,800+ automated tests.
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

            <motion.div
              variants={variants.item}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-2 max-w-xl mx-auto lg:mx-0"
            >
              {[
                { value: '4', label: 'Production systems' },
                { value: '2,800+', label: 'Automated tests' },
                { value: '7+', label: 'Years experience' },
                { value: '~30%', label: 'Revenue growth' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/70 bg-background/50 px-3 py-3 md:px-4 md:py-4 text-center lg:text-left backdrop-blur-sm"
                >
                  <p className="text-xl md:text-2xl font-display font-bold gradient-text">{stat.value}</p>
                  <p className="text-[11px] md:text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={variants.item} className="hidden lg:block">
            <div className="glass-card p-8 lg:p-10">
              <div className="space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">What I build</p>
                  <p className="text-2xl xl:text-3xl font-display font-semibold leading-tight">
                    Production AI systems, owned end to end.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { k: 'AI & LLM', v: 'Agents, RAG, OpenAI & Claude with fallback routing' },
                    { k: 'Backend', v: 'Python, Django, Celery/Redis, PostgreSQL, WebSockets' },
                    { k: 'Frontend', v: 'React, TypeScript, Tailwind, shadcn/ui' },
                    { k: 'DevOps', v: 'Docker, Nginx, Linux VPS, 2,800+ automated tests' },
                  ].map((row) => (
                    <div key={row.k} className="flex items-start gap-3 rounded-[1.25rem] border border-border/70 bg-background/55 p-4">
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{row.k}</span>
                      <p className="text-sm text-muted-foreground leading-snug">{row.v}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.25rem] border border-primary/15 bg-primary/10 p-5">
                  <p className="text-xs uppercase tracking-[0.26em] text-primary font-semibold mb-2">Currently</p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Sole engineer behind four live products, integrating multi-provider LLMs with governance, cost controls and observability.
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
