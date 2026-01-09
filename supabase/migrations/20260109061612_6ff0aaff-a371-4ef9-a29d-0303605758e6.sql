-- Add section_spacing column to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN section_spacing text DEFAULT 'normal' 
CHECK (section_spacing IN ('compact', 'normal', 'spacious'));