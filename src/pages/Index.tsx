import { lazy, Suspense, memo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/sections/HeroSection';
import { useSectionSettings } from '@/hooks/usePortfolioData';
import { SEO } from '@/components/SEO';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { BackToTop } from '@/components/ui/BackToTop';
import { Preloader } from '@/components/ui/Preloader';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

// Lazy load sections below the fold for faster initial load
const AboutSection = lazy(() => import('@/components/sections/AboutSection').then(m => ({ default: m.AboutSection })));
const SkillsSection = lazy(() => import('@/components/sections/SkillsSection').then(m => ({ default: m.SkillsSection })));
const ExperienceSection = lazy(() => import('@/components/sections/ExperienceSection').then(m => ({ default: m.ExperienceSection })));
const ProjectsSection = lazy(() => import('@/components/sections/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const ServicesSection = lazy(() => import('@/components/sections/ServicesSection').then(m => ({ default: m.ServicesSection })));
const ContactSection = lazy(() => import('@/components/sections/ContactSection').then(m => ({ default: m.ContactSection })));
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));

// Minimal loading placeholder
const SectionLoader = memo(() => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
));
SectionLoader.displayName = 'SectionLoader';

const Index = () => {
  useSmoothScroll();
  const { data: sections, isLoading } = useSectionSettings();

  // Helper to check if section is visible
  const isSectionVisible = (key: string) => {
    if (isLoading || !sections) return true;
    const section = sections.find(s => s.section_key === key);
    return section ? section.is_visible : true;
  };

  return (
    <>
      <Preloader />
      <SEO />
      <ScrollProgress />
      <Layout>
        {isSectionVisible('hero') && <HeroSection />}
        <Suspense fallback={<SectionLoader />}>
          {isSectionVisible('about') && <AboutSection />}
          {isSectionVisible('skills') && <SkillsSection />}
          {isSectionVisible('experience') && <ExperienceSection />}
          {isSectionVisible('projects') && <ProjectsSection />}
          {isSectionVisible('testimonials') && <TestimonialsSection />}
          {isSectionVisible('services') && <ServicesSection />}
          {isSectionVisible('contact') && <ContactSection />}
        </Suspense>
      </Layout>
      <BackToTop />
    </>
  );
};

export default Index;