-- Drop the restrictive recursive policy that still exists
DROP POLICY IF EXISTS "Admins can manage roles" ON public.admin_roles;