import { motion } from 'framer-motion';
import { MapPin, User, Sparkles, Phone, Mail, MessageCircle } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useProfileSettings } from '@/hooks/usePortfolioData';
import { Button } from '@/components/ui/button';
import { getAnimationVariants, viewportConfig } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export function AboutSection() {
  const { data: profile, isLoading } = useProfileSettings();
  const { shouldReduceMotion } = useReducedMotion();
  const variants = getAnimationVariants(shouldReduceMotion);

  const handleEmailClick = () => {
    if (profile?.email) {
      const mailtoLink = `mailto:${profile.email}`;
      const gmailLink = `https://mail.google.com/mail/?view=cm&to=${profile.email}`;
      window.open(mailtoLink, '_self');
      setTimeout(() => {
        window.open(gmailLink, '_blank');
      }, 500);
    }
  };

  return (
    <section id="about" className="section-wrapper bg-muted/30 relative overflow-hidden" aria-labelledby="about-heading">
      <AnimatedBackground variant="gradient-orbs" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading title="About Me" subtitle="Get to know me better" />
        
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={variants.container}
          initial="hidden"
          {...(shouldReduceMotion 
            ? { animate: "visible" } 
            : { whileInView: "visible", viewport: viewportConfig }
          )}
        >
          <motion.div
            variants={variants.item}
            className="glass-card p-6 md:p-8 lg:p-12 relative group"
          >
            {profile?.profile_photo_url && (
              <motion.div 
                className="flex justify-center mb-8"
                variants={variants.item}
              >
                <div className="relative">
                  <div className="w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
                    <img 
                      src={profile.profile_photo_url} 
                      alt={`${profile.name || 'Prarit Sidana'} - ${profile.tagline || 'Sales Head & Python Developer'}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="160"
                      height="160"
                    />
                  </div>
                  {!shouldReduceMotion && (
                    <motion.div
                      className="absolute -bottom-2 -right-2 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            <motion.div 
              className="flex items-center gap-3 mb-6"
              variants={variants.item}
            >
              <div className="p-3 rounded-xl bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
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
              <motion.div 
                variants={variants.container}
                className="space-y-6"
              >
                <motion.p 
                  variants={variants.item}
                  className="text-base md:text-lg leading-relaxed text-muted-foreground whitespace-pre-line"
                >
                  {profile?.about}
                </motion.p>
                {profile?.location && (
                  <motion.div 
                    variants={variants.item}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{profile.location}</span>
                  </motion.div>
                )}

                <motion.div 
                  variants={variants.item}
                  className="flex flex-wrap gap-3 pt-4"
                >
                  {profile?.phone && (
                    <a
                      href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </Button>
                    </a>
                  )}
                  {profile?.phone && (
                    <a href={`tel:${profile.phone}`}>
                      <Button variant="outline" className="gap-2">
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                    </a>
                  )}
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleEmailClick();
                      }}
                    >
                      <Button variant="outline" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Button>
                    </a>
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
