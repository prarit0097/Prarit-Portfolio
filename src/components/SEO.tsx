import { useEffect } from 'react';
import { useProfileSettings, useSiteSettings } from '@/hooks/usePortfolioData';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}

export const SEO = ({ 
  title, 
  description, 
  image, 
  url,
  type = 'website',
  article
}: SEOProps) => {
  const { data: profile } = useProfileSettings();
  const { data: siteSettings } = useSiteSettings();

  useEffect(() => {
    const siteTitle = siteSettings?.site_title || 'Prarit Sidana - Portfolio';
    const siteDescription = siteSettings?.site_description || 
      'Personal portfolio of Prarit Sidana - Sales Head, Python Developer, and Data Science enthusiast based in Delhi, India.';
    const profileImage = profile?.profile_photo_url || '';
    const siteName = profile?.name || 'Prarit Sidana';

    const pageTitle = title ? `${title} | ${siteName}` : siteTitle;
    const pageDescription = description || siteDescription;
    const pageImage = image || profileImage;
    const pageUrl = url || window.location.href;

    // Update document title
    document.title = pageTitle;

    // Helper to update or create meta tag
    const updateMeta = (property: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic Meta Tags
    updateMeta('description', pageDescription);
    updateMeta('author', siteName);
    updateMeta('keywords', 'Prarit Sidana, Sales Head, Python Developer, Data Science, Delhi, Portfolio, Web Development, Fintech');
    updateMeta('robots', 'index, follow');

    // Open Graph Tags
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', pageDescription, true);
    updateMeta('og:image', pageImage, true);
    updateMeta('og:url', pageUrl, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', siteName, true);
    updateMeta('og:locale', 'en_IN', true);

    // Twitter Card Tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', pageImage);

    // Article specific tags
    if (type === 'article' && article) {
      if (article.publishedTime) {
        updateMeta('article:published_time', article.publishedTime, true);
      }
      if (article.modifiedTime) {
        updateMeta('article:modified_time', article.modifiedTime, true);
      }
      if (article.author) {
        updateMeta('article:author', article.author, true);
      }
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    // JSON-LD Structured Data
    const existingScript = document.querySelector('script[data-seo="structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = type === 'article' ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: pageDescription,
      image: pageImage,
      author: {
        '@type': 'Person',
        name: siteName,
        url: window.location.origin
      },
      publisher: {
        '@type': 'Person',
        name: siteName
      },
      datePublished: article?.publishedTime,
      dateModified: article?.modifiedTime || article?.publishedTime
    } : {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: siteName,
      url: window.location.origin,
      image: profileImage,
      jobTitle: profile?.tagline || 'Sales Head & Python Developer',
      description: pageDescription,
      address: {
        '@type': 'PostalAddress',
        addressLocality: profile?.location || 'Delhi, India'
      },
      email: profile?.email,
      telephone: profile?.phone,
      sameAs: [
        profile?.linkedin_url,
        profile?.github_url,
        profile?.twitter_url,
        profile?.instagram_url
      ].filter(Boolean)
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'structured-data');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup
    return () => {
      const scriptToRemove = document.querySelector('script[data-seo="structured-data"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, image, url, type, article, profile, siteSettings]);

  return null;
};
