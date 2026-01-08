import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.2 },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, delay: 0.3 },
  },
};

export function SectionHeading({ title, subtitle, centered = true, className }: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        'space-y-4 mb-12 md:mb-16',
        centered && 'text-center',
        className
      )}
    >
      <motion.div variants={titleVariants} className="relative inline-block">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">
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
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
