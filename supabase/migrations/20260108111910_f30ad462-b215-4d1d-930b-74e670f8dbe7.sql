-- Fix overly permissive INSERT policy on enquiries (avoid WITH CHECK true)
DROP POLICY IF EXISTS "Anyone can submit enquiry" ON public.enquiries;

CREATE POLICY "Anyone can submit enquiry"
ON public.enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) > 0
  AND length(trim(email)) > 0
  AND length(trim(subject)) > 0
  AND length(trim(message)) > 0
);