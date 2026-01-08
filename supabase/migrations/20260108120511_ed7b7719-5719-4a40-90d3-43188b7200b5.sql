-- Create section settings table for controlling visibility
CREATE TABLE public.section_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  section_name text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  ordering integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_settings ENABLE ROW LEVEL SECURITY;

-- Public can read section settings
CREATE POLICY "Public can read section settings"
ON public.section_settings
FOR SELECT
USING (true);

-- Admins can manage section settings
CREATE POLICY "Admins can manage section settings"
ON public.section_settings
FOR ALL
USING (is_admin(auth.uid()));

-- Insert default sections
INSERT INTO public.section_settings (section_key, section_name, is_visible, ordering) VALUES
('hero', 'Hero Section', true, 1),
('about', 'About Me', true, 2),
('skills', 'Skills', true, 3),
('experience', 'Experience', true, 4),
('projects', 'Projects', true, 5),
('services', 'Services', true, 6),
('contact', 'Contact', true, 7);

-- Add updated_at trigger
CREATE TRIGGER update_section_settings_updated_at
BEFORE UPDATE ON public.section_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();