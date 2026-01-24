import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, Mail, Heart } from 'lucide-react';
import { useProfileSettings, useSectionSettings } from '@/hooks/usePortfolioData';

export function Footer() {
  const { data: profile } = useProfileSettings();
  const { data: sectionSettings, isLoading: isSectionsLoading } = useSectionSettings();

  const isProjectsVisible = isSectionsLoading || !sectionSettings
    ? true
    : (sectionSettings.find((s) => s.section_key === 'projects')?.is_visible ?? true);

  const handleEmailClick = () => {
    if (profile?.email) {
      const mailtoLink = `mailto:${profile.email}`;
      const gmailLink = `https://mail.google.com/mail/?view=cm&to=${profile.email}`;
      
      // Try to open default mail app
      window.open(mailtoLink, '_self');
      
      // Fallback to Gmail after a short delay
      setTimeout(() => {
        window.open(gmailLink, '_blank');
      }, 500);
    }
  };

  const socialLinks = [
    { icon: Github, href: profile?.github_url, label: 'GitHub' },
    { icon: Linkedin, href: profile?.linkedin_url, label: 'LinkedIn' },
    { icon: Twitter, href: profile?.twitter_url, label: 'Twitter' },
    { icon: Instagram, href: profile?.instagram_url, label: 'Instagram' },
  ].filter(link => link.href);

  const quickLinks: Array<{ href: string; label: string }> = [
    { href: '/#about', label: 'About' },
    ...(isProjectsVisible ? [{ href: '/#projects', label: 'Projects' }] : []),
    { href: '/#experience', label: 'Experience' },
    { href: '/blog', label: 'Blog' },
    { href: '/#contact', label: 'Contact' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <footer className="relative border-t border-border bg-card/50" role="contentinfo" itemScope itemType="https://schema.org/WPFooter">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground max-w-xs">
              {profile?.tagline || 'Building at the intersection of business and technology.'}
            </p>
          </div>

          {/* Quick Links */}
          <nav className="space-y-4" aria-label="Footer navigation">
            <h2 className="font-display font-semibold text-foreground">Quick Links</h2>
            <ul className="grid grid-cols-2 gap-2" role="list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-foreground">Connect</h2>
            <nav aria-label="Social media links">
              <ul className="flex gap-3" role="list">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors inline-flex"
                      aria-label={`Follow on ${link.label}`}
                    >
                      <link.icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
                {profile?.email && (
                  <li>
                    <a
                      href={`mailto:${profile.email}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleEmailClick();
                      }}
                      className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors inline-flex cursor-pointer"
                      aria-label="Send email"
                    >
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                )}
              </ul>
            </nav>
            {profile?.location && (
              <address className="text-sm text-muted-foreground not-italic" itemProp="address">
                📍 {profile.location}
              </address>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profile?.name || 'Prarit Sidana'}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" aria-label="love" /> in {profile?.location || 'Delhi, India'}
          </p>
        </div>
      </div>
    </footer>
  );
}
