
-- Create a public view that only exposes non-sensitive profile fields
CREATE VIEW public.public_profiles AS
SELECT user_id, display_name, avatar_url
FROM public.profiles;

-- Drop the overly permissive SELECT policy
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;

-- Only authenticated users can read the full profiles table
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
