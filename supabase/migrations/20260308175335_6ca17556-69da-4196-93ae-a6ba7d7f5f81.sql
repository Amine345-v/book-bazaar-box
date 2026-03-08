
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS title_i18n jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS description_i18n jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS category_i18n jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS format_i18n jsonb DEFAULT '{}'::jsonb;
