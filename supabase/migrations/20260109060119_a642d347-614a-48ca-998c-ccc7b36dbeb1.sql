-- Remove stats entry from section_settings
DELETE FROM public.section_settings 
WHERE section_key = 'stats';

-- Drop the stats table (this also removes RLS policies)
DROP TABLE IF EXISTS public.stats CASCADE;