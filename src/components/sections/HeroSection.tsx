import { motion } from 'framer-motion';
import { Download, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileSettings, useSectionSettings } from '@/hooks/usePortfolioData';
import { TypeWriter } from '@/components/ui/TypeWriter';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function HeroSection() {
  const { data: profile, isLoading } = useProfileSettings();
  const { data: sectionSettings, isLoading: isSectionsLoading } = useSectionSettings();

  const isProjectsVisible = isSectionsLoading || !sectionSettings
    ? true
    : (sectionSettings.find((s) => s.section_key === 'projects')?.is_visible ?? true);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      aria-label="Introduction"
      itemScope 
      itemType="https://schema.org/Person"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 30, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/30 rounded-full blur-3xl"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 40, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/40 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm tracking-wide">
                Hello, I'm
              </span>
            </motion.div>
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight"
              itemProp="name"
            >
              {isLoading ? (
                <span className="skeleton inline-block h-20 w-80 rounded" />
              ) : (
                <motion.span
                  className="inline-block"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  {profile?.name || 'Prarit Sidana'}
                </motion.span>
              )}
            </h1>
            <motion.div 
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance h-8"
            >
              {isLoading ? (
                <span className="skeleton inline-block h-8 w-96 rounded" />
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
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {isProjectsVisible && (
              <motion.a 
                href="#projects"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="btn-primary h-12 px-8 text-base group">
                  <span>View Projects</span>
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.a>
            )}
            {profile?.resume_url && (
              <motion.a 
                href={profile.resume_url} 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="btn-ghost h-12 px-8 text-base">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </motion.a>
            )}
            <motion.a 
              href="#contact"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" className="btn-ghost h-12 px-8 text-base">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </motion.a>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
