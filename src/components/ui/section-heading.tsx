import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  id?: string;
}

const titleVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: 0.1 },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.4, delay: 0.15 },
  },
};

export function SectionHeading({ title, subtitle, centered = true, className, id }: SectionHeadingProps) {
  // Generate id from title if not provided
  const headingId = id || title.toLowerCase().replace(/\s+/g, '-') + '-heading';
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px" }}
      className={cn(
        'space-y-3 md:space-y-4 mb-8 md:mb-12 lg:mb-16',
        centered && 'text-center',
        className
      )}
    >
      <motion.div variants={titleVariants} className="relative inline-block">
        <h2 id={headingId} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">
          {title}
        </h2>
        <motion.div
          variants={lineVariants}
          className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ originX: 0.5 }}
        />
      </motion.div>
      {subtitle && (
        <motion.p 
          variants={subtitleVariants}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 md:px-0"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
