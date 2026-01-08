-- Drop the recursive policy on admin_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.admin_roles;

-- Create a simple non-recursive SELECT policy
-- Users can only read their own role (prevents recursion in is_admin function)
CREATE POLICY "Users can read own role"
ON public.admin_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());