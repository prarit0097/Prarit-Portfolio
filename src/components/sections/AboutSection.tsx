import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useProfileSettings } from '@/hooks/usePortfolioData';

export function AboutSection() {
  const { data: profile, isLoading } = useProfileSettings();

  return (
    <section id="about" className="section-wrapper bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading title="About Me" subtitle="Get to know me better" />
        
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12"
          >
            {isLoading ? (
              <div className="space-y-4">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-4 w-4/5 rounded" />
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                  {profile?.about}
                </p>
                {profile?.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
