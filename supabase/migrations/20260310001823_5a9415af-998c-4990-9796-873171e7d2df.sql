
-- Reading progress table
CREATE TABLE public.reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  book_id text NOT NULL,
  cfi_position text,
  percentage numeric NOT NULL DEFAULT 0,
  last_read_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id)
);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.reading_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.reading_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.reading_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Bookmarks table
CREATE TABLE public.reader_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  book_id text NOT NULL,
  cfi_position text NOT NULL,
  label text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.reader_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks" ON public.reader_bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON public.reader_bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.reader_bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Highlights table
CREATE TABLE public.reader_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  book_id text NOT NULL,
  cfi_range text NOT NULL,
  text text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT 'yellow',
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.reader_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own highlights" ON public.reader_highlights FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own highlights" ON public.reader_highlights FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own highlights" ON public.reader_highlights FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own highlights" ON public.reader_highlights FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create private bucket for ebook files
INSERT INTO storage.buckets (id, name, public) VALUES ('ebooks', 'ebooks', false);

-- Only allow authenticated users who purchased the book to read
CREATE POLICY "Purchased users can read ebooks" ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'ebooks' AND
  EXISTS (
    SELECT 1 FROM public.purchases
    WHERE purchases.user_id = auth.uid()
    AND purchases.book_id = (storage.foldername(name))[1]
    AND purchases.status = 'completed'
  )
);

-- Admins can upload ebooks
CREATE POLICY "Admins can upload ebooks" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'ebooks' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete ebooks" ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'ebooks' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Add epub_key column to books table for mapping to storage
ALTER TABLE public.books ADD COLUMN epub_key text;

-- Updated_at triggers
CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON public.reading_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reader_highlights_updated_at BEFORE UPDATE ON public.reader_highlights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
