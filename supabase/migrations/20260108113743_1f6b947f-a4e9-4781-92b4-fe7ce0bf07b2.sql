-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Allow admins to upload project images
CREATE POLICY "Admins can upload project images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'project-images' AND is_admin(auth.uid()));

-- Allow admins to update project images
CREATE POLICY "Admins can update project images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'project-images' AND is_admin(auth.uid()));

-- Allow admins to delete project images
CREATE POLICY "Admins can delete project images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'project-images' AND is_admin(auth.uid()));

-- Allow public to view project images
CREATE POLICY "Public can view project images" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'project-images');