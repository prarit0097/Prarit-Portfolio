// Database types for the portfolio

export interface ProfileSettings {
  id: string;
  name: string;
  tagline: string | null;
  about: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  profile_photo_url: string | null;
  resume_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string | null;
  site_description: string | null;
  primary_color: string | null;
  analytics_id: string | null;
  favicon_url: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string | null;
  ordering: number;
  created_at: string;
  updated_at: string;
  skills?: Skill[];
}

export interface Skill {
  id: string;
  category_id: string | null;
  name: string;
  level: number;
  ordering: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  achievements: string[] | null;
  ordering: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  cover_image_url: string | null;
  tech_stack: string[] | null;
  category: string | null;
  github_url: string | null;
  live_url: string | null;
  is_featured: boolean;
  ordering: number;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string | null;
  image_url: string;
  caption: string | null;
  ordering: number;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  ordering: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  message: string;
  avatar_url: string | null;
  is_active: boolean;
  ordering: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor';
  created_at: string;
}

export interface SectionSetting {
  id: string;
  section_key: string;
  section_name: string;
  is_visible: boolean;
  ordering: number;
  created_at: string;
  updated_at: string;
}

export interface Stat {
  id: string;
  icon: string;
  value: number;
  suffix: string;
  label: string;
  ordering: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}