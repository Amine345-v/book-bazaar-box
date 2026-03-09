import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export function useWishlistQuery() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [] as string[];
      const { data, error } = await supabase
        .from("wishlists")
        .select("book_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []).map((w) => w.book_id);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAddToWishlist() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, book_id: bookId });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Added to wishlist!");
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useRemoveFromWishlist() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.info("Removed from wishlist");
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useToggleWishlist() {
  const { data: wishlistIds = [] } = useWishlistQuery();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();
  const user = useAuthStore((s) => s.user);

  const isInWishlist = (bookId: string) => wishlistIds.includes(bookId);

  const toggleWishlist = async (bookId: string) => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    if (isInWishlist(bookId)) {
      removeMutation.mutate(bookId);
    } else {
      addMutation.mutate(bookId);
    }
  };

  return {
    wishlistIds: new Set(wishlistIds),
    isInWishlist,
    toggleWishlist,
    loading: addMutation.isPending || removeMutation.isPending,
  };
}
