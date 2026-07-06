import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { headingVariants, reducedHeadingVariants, viewportConfig } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  centered?: boolean;
  className?: string;
  id?: string;
}

export function SectionHeading({ title, subtitle, eyebrow, centered = true, className, id }: SectionHeadingProps) {
  const headingId = id || title.toLowerCase().replace(/\s+/g, '-') + '-heading';
  const { shouldReduceMotion } = useReducedMotion();
  const variants = shouldReduceMotion ? reducedHeadingVariants : headingVariants;
  
  return (
    <motion.div
      initial="hidden"
      {...(shouldReduceMotion 
        ? { animate: "visible" } 
        : { whileInView: "visible", viewport: viewportConfig }
      )}
      className={cn(
        'space-y-3 md:space-y-4 mb-8 md:mb-12 lg:mb-16',
        centered && 'text-center',
        className
      )}
    >
      <motion.div variants={variants.title} className="relative inline-block">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary mb-4">
            {eyebrow}
          </span>
        )}
        <h2 id={headingId} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">
          {title}
        </h2>
        <motion.div
          variants={variants.line}
          className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ originX: 0.5 }}
        />
      </motion.div>
      {subtitle && (
        <motion.p 
          variants={variants.subtitle}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 md:px-0"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
