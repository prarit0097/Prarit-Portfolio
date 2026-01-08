-- Fix function search path issue
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- The "anyone can submit enquiry" policy is intentional for public contact forms
-- but we should add some basic protection via rate limiting in edge function
-- The policy itself is acceptable for a contact form use case

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
);

-- Storage policies for public read and admin write
CREATE POLICY "Public can view portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Admins can upload portfolio assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update portfolio assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio-assets' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete portfolio assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio-assets' AND public.is_admin(auth.uid()));