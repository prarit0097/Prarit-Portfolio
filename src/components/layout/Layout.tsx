import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useSiteSettings } from '@/hooks/usePortfolioData';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter }: LayoutProps) {
  const { data: siteSettings } = useSiteSettings();
  
  const spacingClass = siteSettings?.section_spacing 
    ? `spacing-${siteSettings.section_spacing}` 
    : '';

  return (
    <div className={cn("min-h-screen flex flex-col", spacingClass)}>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
