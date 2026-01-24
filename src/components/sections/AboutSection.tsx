import { motion } from 'framer-motion';
import { MapPin, User, Sparkles, Phone, Mail, MessageCircle } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useProfileSettings } from '@/hooks/usePortfolioData';
import { Button } from '@/components/ui/button';

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

  const handleEmailClick = () => {
    if (profile?.email) {
      const mailtoLink = `mailto:${profile.email}`;
      const gmailLink = `https://mail.google.com/mail/?view=cm&to=${profile.email}`;
      
      // Try to open default mail app
      const mailWindow = window.open(mailtoLink, '_self');
      
      // Fallback to Gmail after a short delay if mailto doesn't work
      setTimeout(() => {
        window.open(gmailLink, '_blank');
      }, 500);
    }
  };

  return (
    <section id="about" className="section-wrapper bg-muted/30 relative overflow-hidden" aria-labelledby="about-heading">
      {/* Simplified background - static elements for performance */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />

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
                      alt={`${profile.name || 'Prarit Sidana'} - ${profile.tagline || 'Sales Head & Python Developer'}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="160"
                      height="160"
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

                {/* Contact Buttons */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap gap-3 pt-4"
                >
                  {profile?.phone && (
                    <motion.a
                      href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </Button>
                    </motion.a>
                  )}
                  {profile?.phone && (
                    <motion.a
                      href={`tel:${profile.phone}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="gap-2">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                    </motion.a>
                  )}
                  {profile?.email && (
                    <motion.a
                      href={`mailto:${profile.email}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleEmailClick();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </motion.a>
                  )}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
