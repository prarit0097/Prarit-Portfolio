import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ContentSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'image' | 'hero' | 'timeline';
  className?: string;
  lines?: number;
}

export function ContentSkeleton({ 
  variant = 'card', 
  className,
  lines = 3 
}: ContentSkeletonProps) {
  const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  if (variant === 'hero') {
    return (
      <div className={cn('space-y-6 p-8', className)}>
        <div className={cn('h-4 w-24 rounded bg-muted', shimmer)} />
        <div className={cn('h-16 w-3/4 rounded bg-muted', shimmer)} />
        <div className={cn('h-6 w-1/2 rounded bg-muted', shimmer)} />
        <div className="flex gap-4 pt-4">
          <div className={cn('h-12 w-32 rounded-lg bg-muted', shimmer)} />
          <div className={cn('h-12 w-32 rounded-lg bg-muted', shimmer)} />
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className={cn('h-12 w-12 rounded-full bg-muted', shimmer)} />
        <div className="space-y-2">
          <div className={cn('h-4 w-24 rounded bg-muted', shimmer)} />
          <div className={cn('h-3 w-16 rounded bg-muted', shimmer)} />
        </div>
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div className={cn('aspect-video rounded-lg bg-muted', shimmer, className)} />
    );
  }

  if (variant === 'timeline') {
    return (
      <div className={cn('space-y-8', className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className={cn('h-4 w-4 rounded-full bg-muted flex-shrink-0 mt-1', shimmer)} />
            <div className="space-y-3 flex-1">
              <div className={cn('h-5 w-3/4 rounded bg-muted', shimmer)} />
              <div className={cn('h-4 w-1/2 rounded bg-muted', shimmer)} />
              <div className={cn('h-3 w-full rounded bg-muted', shimmer)} />
              <div className={cn('h-3 w-2/3 rounded bg-muted', shimmer)} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {[...Array(lines)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 rounded bg-muted',
              shimmer,
              i === lines - 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('rounded-xl border border-border/50 p-6 space-y-4', className)}
    >
      <div className={cn('h-40 rounded-lg bg-muted', shimmer)} />
      <div className={cn('h-5 w-3/4 rounded bg-muted', shimmer)} />
      <div className="space-y-2">
        <div className={cn('h-3 w-full rounded bg-muted', shimmer)} />
        <div className={cn('h-3 w-2/3 rounded bg-muted', shimmer)} />
      </div>
      <div className="flex gap-2">
        <div className={cn('h-6 w-16 rounded-full bg-muted', shimmer)} />
        <div className={cn('h-6 w-16 rounded-full bg-muted', shimmer)} />
      </div>
    </motion.div>
  );
}

export function SkeletonGrid({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {[...Array(count)].map((_, i) => (
        <ContentSkeleton key={i} />
      ))}
    </div>
  );
}
