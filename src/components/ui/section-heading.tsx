import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { headingVariants, viewportConfig } from '@/lib/animations';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  id?: string;
}

export function SectionHeading({ title, subtitle, centered = true, className, id }: SectionHeadingProps) {
  const headingId = id || title.toLowerCase().replace(/\s+/g, '-') + '-heading';
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      className={cn(
        'space-y-3 md:space-y-4 mb-8 md:mb-12 lg:mb-16',
        centered && 'text-center',
        className
      )}
    >
      <motion.div variants={headingVariants.title} className="relative inline-block">
        <h2 id={headingId} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">
          {title}
        </h2>
        <motion.div
          variants={headingVariants.line}
          className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ originX: 0.5 }}
        />
      </motion.div>
      {subtitle && (
        <motion.p 
          variants={headingVariants.subtitle}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 md:px-0"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
