
DROP VIEW public.public_profiles;
CREATE VIEW public.public_profiles WITH (security_invoker = true) AS
SELECT user_id, display_name, avatar_url
FROM public.profiles;
