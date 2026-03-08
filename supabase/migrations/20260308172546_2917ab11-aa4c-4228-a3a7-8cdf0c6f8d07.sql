
CREATE OR REPLACE FUNCTION public.update_book_review_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_book_id text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_book_id := OLD.book_id;
  ELSE
    target_book_id := NEW.book_id;
  END IF;

  UPDATE public.books
  SET
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE book_id = target_book_id), 0),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE book_id = target_book_id),
    updated_at = now()
  WHERE id = target_book_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_book_review_stats
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_book_review_stats();
