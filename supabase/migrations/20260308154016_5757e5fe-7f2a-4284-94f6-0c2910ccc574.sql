
-- Drop the view since we'll use a different approach
DROP VIEW public.public_profiles;

-- Drop the restrictive policy
DROP POLICY "Authenticated users can view profiles" ON public.profiles;

-- Restore public read but only through RLS — this is needed for showing reviewer names
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);
