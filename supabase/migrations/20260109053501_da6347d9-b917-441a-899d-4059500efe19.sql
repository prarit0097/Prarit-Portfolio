-- Create stats table for storing stats data
CREATE TABLE public.stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon text NOT NULL DEFAULT 'Briefcase',
  value integer NOT NULL DEFAULT 0,
  suffix text NOT NULL DEFAULT '+',
  label text NOT NULL,
  ordering integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can read active stats" ON public.stats
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage stats" ON public.stats
  FOR ALL USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_stats_updated_at
  BEFORE UPDATE ON public.stats
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert default stats
INSERT INTO public.stats (icon, value, suffix, label, ordering) VALUES
  ('Briefcase', 5, '+', 'Years Experience', 1),
  ('Code', 50, '+', 'Projects Completed', 2),
  ('Users', 30, '+', 'Happy Clients', 3),
  ('Award', 10, '+', 'Awards Won', 4);

-- Add stats to section_settings if not exists
INSERT INTO public.section_settings (section_key, section_name, is_visible, ordering)
VALUES ('stats', 'Stats Counter', true, 3)
ON CONFLICT (section_key) DO NOTHING;