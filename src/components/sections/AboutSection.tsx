import { motion } from 'framer-motion';
import { MapPin, User, Sparkles } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useProfileSettings } from '@/hooks/usePortfolioData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function AboutSection() {
  const { data: profile, isLoading } = useProfileSettings();

  return (
    <section id="about" className="section-wrapper bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl"
        animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading title="About Me" subtitle="Get to know me better" />
        
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={itemVariants}
            className="glass-card p-8 md:p-12 relative group"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated border gradient */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10"
              style={{ padding: '2px' }}
            />
            
            {/* Profile Photo */}
            {profile?.profile_photo_url && (
              <motion.div 
                className="flex justify-center mb-8"
                variants={itemVariants}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
                    <img 
                      src={profile.profile_photo_url} 
                      alt={profile.name || "Profile"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div
                    className="absolute -bottom-2 -right-2 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            <motion.div 
              className="flex items-center gap-3 mb-6"
              variants={itemVariants}
            >
              <motion.div 
                className="p-3 rounded-xl bg-primary/10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <User className="h-6 w-6 text-primary" />
              </motion.div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Who am I?</span>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-4 w-4/5 rounded" />
              </div>
            ) : (
              <motion.div variants={containerVariants} className="space-y-6">
                <motion.p 
                  variants={itemVariants}
                  className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line"
                >
                  {profile?.about}
                </motion.p>
                {profile?.location && (
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-2 text-muted-foreground"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span>{profile.location}</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
