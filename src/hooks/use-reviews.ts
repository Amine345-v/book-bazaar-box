import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export type Review = {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  title: string;
  content: string | null;
  created_at: string;
  display_name: string | null;
};

async function fetchReviewsWithProfiles(bookId: string): Promise<Review[]> {
  const { data: reviewsData, error } = await supabase
    .from("reviews")
    .select("id, user_id, book_id, rating, title, content, created_at")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!reviewsData || reviewsData.length === 0) return [];

  const userIds = [...new Set(reviewsData.map((r) => r.user_id))];
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("user_id, display_name")
    .in("user_id", userIds);

  const profileMap = new Map(
    (profilesData || []).map((p) => [p.user_id, p.display_name])
  );

  return reviewsData.map((r) => ({
    ...r,
    display_name: profileMap.get(r.user_id) || null,
  }));
}

export function useReviews(bookId: string) {
  return useQuery({
    queryKey: ["reviews", bookId],
    queryFn: () => fetchReviewsWithProfiles(bookId),
    staleTime: 60 * 1000,
  });
}

export function useCreateReview(bookId: string) {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { rating: number; title: string; content: string | null }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        book_id: bookId,
        rating: input.rating,
        title: input.title,
        content: input.content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review submitted!");
      qc.invalidateQueries({ queryKey: ["reviews", bookId] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateReview(bookId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; rating: number; title: string; content: string | null }) => {
      const { error } = await supabase.from("reviews").update({
        rating: input.rating,
        title: input.title,
        content: input.content,
      }).eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review updated!");
      qc.invalidateQueries({ queryKey: ["reviews", bookId] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteReview(bookId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review deleted");
      qc.invalidateQueries({ queryKey: ["reviews", bookId] });
    },
    onError: (e) => toast.error(e.message),
  });
}
