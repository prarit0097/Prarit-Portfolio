import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { useSectionSettings } from '@/hooks/usePortfolioData';
import { SEO } from '@/components/SEO';

const Index = () => {
  const { data: sections, isLoading } = useSectionSettings();

  // Helper to check if section is visible
  const isSectionVisible = (key: string) => {
    if (isLoading || !sections) return true; // Show all while loading
    const section = sections.find(s => s.section_key === key);
    return section ? section.is_visible : true;
  };

  return (
    <>
      <SEO />
      <Layout>
        {isSectionVisible('hero') && <HeroSection />}
        {isSectionVisible('about') && <AboutSection />}
        {isSectionVisible('skills') && <SkillsSection />}
        {isSectionVisible('experience') && <ExperienceSection />}
        {isSectionVisible('projects') && <ProjectsSection />}
        {isSectionVisible('services') && <ServicesSection />}
        {isSectionVisible('contact') && <ContactSection />}
      </Layout>
    </>
  );
};

export default Index;