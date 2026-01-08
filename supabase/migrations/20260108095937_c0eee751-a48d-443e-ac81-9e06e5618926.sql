-- Profile Settings (single row for site owner)
CREATE TABLE public.profile_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Prarit Sidana',
  tagline TEXT DEFAULT 'Sales Head & Python Developer',
  about TEXT DEFAULT 'Passionate about building innovative solutions that bridge sales strategy and technology.',
  location TEXT DEFAULT 'Delhi, India',
  email TEXT DEFAULT 'contact@prarit.dev',
  phone TEXT,
  profile_photo_url TEXT,
  resume_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Settings (SEO, theme, etc.)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title TEXT DEFAULT 'Prarit Sidana - Portfolio',
  site_description TEXT DEFAULT 'Personal portfolio of Prarit Sidana - Sales Head & Python Developer',
  primary_color TEXT DEFAULT '#10b981',
  analytics_id TEXT,
  favicon_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill Categories
CREATE TABLE public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills Items
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 80 CHECK (level >= 0 AND level <= 100),
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  achievements TEXT[],
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  cover_image_url TEXT,
  tech_stack TEXT[],
  category TEXT,
  github_url TEXT,
  live_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Images (gallery)
CREATE TABLE public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  ordering INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  message TEXT NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  ordering INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries (contact form submissions)
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users role enum
CREATE TYPE public.admin_role AS ENUM ('admin', 'editor');

-- Admin user roles (for future multi-admin support)
CREATE TABLE public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role admin_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- PUBLIC READ POLICIES (for website visitors)
CREATE POLICY "Public can read profile" ON public.profile_settings FOR SELECT USING (true);
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read skill categories" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Public can read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public can read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can read project images" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "Public can read active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);

-- ADMIN WRITE POLICIES (for authenticated admins)
CREATE POLICY "Admins can manage profile" ON public.profile_settings FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage skill categories" ON public.skill_categories FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage skills" ON public.skills FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage experiences" ON public.experiences FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage project images" ON public.project_images FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can view enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles" ON public.admin_roles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profile_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.skill_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default profile
INSERT INTO public.profile_settings (name, tagline, about, location, email) VALUES (
  'Prarit Sidana',
  'Sales Head & Python Developer | Building at the Intersection of Business & Technology',
  'I am a passionate Sales Head and Python Developer based in Delhi, India. With a unique blend of business acumen and technical expertise, I specialize in building innovative solutions that drive growth and efficiency. My journey spans fintech, data science, and entrepreneurship, where I''ve consistently delivered results that matter.

I believe in the power of technology to transform businesses and create meaningful impact. Whether it''s automating complex workflows, analyzing data for actionable insights, or crafting sales strategies that convert, I bring a holistic approach to every challenge.',
  'Delhi, India',
  'contact@prarit.dev'
);

-- Insert default site settings
INSERT INTO public.site_settings (site_title, site_description) VALUES (
  'Prarit Sidana - Portfolio',
  'Personal portfolio of Prarit Sidana - Sales Head, Python Developer, and Data Science enthusiast based in Delhi, India.'
);

-- Insert sample skill categories and skills
INSERT INTO public.skill_categories (name, icon, ordering) VALUES
  ('Sales & Business', 'TrendingUp', 1),
  ('Programming', 'Code', 2),
  ('Data Science', 'BarChart3', 3),
  ('Tools & Platforms', 'Wrench', 4);

INSERT INTO public.skills (category_id, name, level, ordering) 
SELECT id, skill_name, skill_level, skill_order FROM public.skill_categories
CROSS JOIN (VALUES 
  ('TrendingUp', 'Sales Strategy', 95, 1),
  ('TrendingUp', 'Business Development', 90, 2),
  ('TrendingUp', 'Team Leadership', 88, 3),
  ('TrendingUp', 'Client Relations', 92, 4),
  ('Code', 'Python', 90, 1),
  ('Code', 'JavaScript/TypeScript', 85, 2),
  ('Code', 'SQL', 88, 3),
  ('Code', 'REST APIs', 85, 4),
  ('BarChart3', 'Data Analysis', 88, 1),
  ('BarChart3', 'Machine Learning', 75, 2),
  ('BarChart3', 'Pandas/NumPy', 85, 3),
  ('BarChart3', 'Data Visualization', 82, 4),
  ('Wrench', 'Git/GitHub', 90, 1),
  ('Wrench', 'Docker', 78, 2),
  ('Wrench', 'AWS/Cloud', 75, 3),
  ('Wrench', 'Automation Tools', 88, 4)
) AS skills(cat_icon, skill_name, skill_level, skill_order)
WHERE skill_categories.icon = skills.cat_icon;

-- Insert sample experiences
INSERT INTO public.experiences (company, role, location, start_date, end_date, is_current, description, achievements, ordering) VALUES
  ('Tech Startup XYZ', 'Sales Head', 'Delhi, India', '2022-01-01', NULL, TRUE, 'Leading sales operations and strategy for a fast-growing fintech startup. Managing a team of 10+ sales professionals and driving revenue growth through innovative approaches.', ARRAY['Increased revenue by 150% in first year', 'Built and trained high-performing sales team', 'Implemented CRM automation reducing manual work by 60%'], 1),
  ('Digital Solutions Inc', 'Senior Sales Manager', 'Delhi, India', '2020-03-01', '2021-12-31', FALSE, 'Managed enterprise sales for B2B software solutions. Responsible for strategic partnerships and key account management.', ARRAY['Closed deals worth ₹5Cr+ annually', 'Expanded client base by 200%', 'Developed sales playbooks and training programs'], 2),
  ('Data Analytics Firm', 'Python Developer (Part-time)', 'Remote', '2019-06-01', '2020-02-28', FALSE, 'Developed data pipelines and automation scripts for analytics projects. Built dashboards and reporting tools.', ARRAY['Automated reporting saving 20+ hours/week', 'Built ETL pipelines for 1M+ records', 'Created client-facing analytics dashboards'], 3);

-- Insert sample projects
INSERT INTO public.projects (title, slug, short_description, full_description, tech_stack, category, is_featured, ordering) VALUES
  ('Sales Analytics Dashboard', 'sales-analytics-dashboard', 'Real-time sales analytics platform with predictive insights', 'A comprehensive sales analytics dashboard that provides real-time insights into sales performance, pipeline health, and revenue forecasting. Built with Python backend and React frontend, featuring ML-powered predictions and automated reporting.', ARRAY['Python', 'FastAPI', 'React', 'PostgreSQL', 'TensorFlow'], 'Data Science', TRUE, 1),
  ('Fintech CRM Automation', 'fintech-crm-automation', 'Automated CRM workflows for fintech operations', 'End-to-end CRM automation system designed specifically for fintech companies. Includes lead scoring, automated follow-ups, document processing, and compliance tracking.', ARRAY['Python', 'Zapier', 'Salesforce', 'AWS Lambda'], 'Automation', TRUE, 2),
  ('Invoice Processing Bot', 'invoice-processing-bot', 'AI-powered invoice extraction and processing', 'An intelligent bot that extracts data from invoices using OCR and ML, validates entries, and automatically processes payments. Reduced manual processing time by 80%.', ARRAY['Python', 'OpenCV', 'Tesseract', 'PostgreSQL'], 'Automation', FALSE, 3),
  ('Market Analysis Tool', 'market-analysis-tool', 'Competitor and market intelligence platform', 'A web scraping and analysis tool that gathers market intelligence from multiple sources, providing actionable insights for strategic decision-making.', ARRAY['Python', 'Scrapy', 'Pandas', 'Plotly'], 'Data Science', FALSE, 4);

-- Insert sample services
INSERT INTO public.services (title, description, icon, ordering) VALUES
  ('Sales Strategy Consulting', 'Develop winning sales strategies tailored to your business. From go-to-market planning to sales process optimization, I help teams close more deals.', 'Target', 1),
  ('Python Development', 'Custom Python solutions for automation, data processing, and backend systems. Clean, efficient, and scalable code.', 'Code', 2),
  ('Data Analytics & BI', 'Transform your data into actionable insights. From dashboards to predictive models, make data-driven decisions.', 'BarChart3', 3),
  ('Process Automation', 'Eliminate repetitive tasks and streamline workflows. Save time and reduce errors with custom automation solutions.', 'Zap', 4);

-- Insert sample testimonials
INSERT INTO public.testimonials (name, role, company, message, ordering) VALUES
  ('Rahul Sharma', 'CEO', 'TechVentures India', 'Prarit transformed our sales operations. His unique combination of technical and business skills helped us 3x our revenue in just 8 months.', 1),
  ('Priya Mehta', 'VP Sales', 'FinServ Solutions', 'Working with Prarit was a game-changer. His Python automation tools saved our team countless hours and improved accuracy significantly.', 2),
  ('Amit Kumar', 'Founder', 'DataFirst Analytics', 'Exceptional problem-solver. Prarit built us a custom analytics dashboard that our entire team now relies on daily.', 3);