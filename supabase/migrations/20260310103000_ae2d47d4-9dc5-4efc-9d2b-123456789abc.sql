-- Add reading_sessions table for reading time tracking
CREATE TABLE public.reading_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id text NOT NULL,
  duration_seconds numeric NOT NULL,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ended_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their reading sessions"
  ON public.reading_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their reading sessions"
  ON public.reading_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_reading_sessions_updated_at
  BEFORE UPDATE ON public.reading_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();