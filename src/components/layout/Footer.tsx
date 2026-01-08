import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, Mail, Heart } from 'lucide-react';
import { useProfileSettings } from '@/hooks/usePortfolioData';

export function Footer() {
  const { data: profile } = useProfileSettings();

  const socialLinks = [
    { icon: Github, href: profile?.github_url, label: 'GitHub' },
    { icon: Linkedin, href: profile?.linkedin_url, label: 'LinkedIn' },
    { icon: Twitter, href: profile?.twitter_url, label: 'Twitter' },
    { icon: Instagram, href: profile?.instagram_url, label: 'Instagram' },
    { icon: Mail, href: profile?.email ? `mailto:${profile.email}` : null, label: 'Email' },
  ].filter(link => link.href);

  return (
    <footer className="relative border-t border-border bg-card/50">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-display font-bold gradient-text">
                {profile?.name?.split(' ').map(n => n[0]).join('') || 'PS'}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {profile?.tagline || 'Building at the intersection of business and technology.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/#about', label: 'About' },
                { href: '/#projects', label: 'Projects' },
                { href: '/#experience', label: 'Experience' },
                { href: '/blog', label: 'Blog' },
                { href: '/#contact', label: 'Contact' },
                { href: '/admin', label: 'Admin' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            {profile?.location && (
              <p className="text-sm text-muted-foreground">
                📍 {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profile?.name || 'Prarit Sidana'}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> in {profile?.location || 'Delhi, India'}
          </p>
        </div>
      </div>
    </footer>
  );
}
