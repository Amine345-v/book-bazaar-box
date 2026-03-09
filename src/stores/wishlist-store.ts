import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuthStore } from "./auth-store";

type WishlistState = {
  wishlistIds: Set<string>;
  loading: boolean;
  _fetchedForUser: string | null;
  fetchWishlist: (userId: string) => Promise<void>;
  toggleWishlist: (bookId: string) => Promise<void>;
  isInWishlist: (bookId: string) => boolean;
  reset: () => void;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: new Set(),
  loading: false,
  _fetchedForUser: null,

  fetchWishlist: async (userId) => {
    if (get()._fetchedForUser === userId) return;
    const { data } = await supabase
      .from("wishlists")
      .select("book_id")
      .eq("user_id", userId);
    if (data) {
      set({
        wishlistIds: new Set(data.map((w) => w.book_id)),
        _fetchedForUser: userId,
      });
    }
  },

  toggleWishlist: async (bookId) => {
    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    set({ loading: true });
    const wishlistIds = get().wishlistIds;

    if (wishlistIds.has(bookId)) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);
      if (!error) {
        const next = new Set(wishlistIds);
        next.delete(bookId);
        set({ wishlistIds: next });
        toast.info("Removed from wishlist");
      }
    } else {
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, book_id: bookId });
      if (!error) {
        set({ wishlistIds: new Set(wishlistIds).add(bookId) });
        toast.success("Added to wishlist!");
      }
    }
    set({ loading: false });
  },

  isInWishlist: (bookId) => get().wishlistIds.has(bookId),

  reset: () => set({ wishlistIds: new Set(), _fetchedForUser: null }),
}));

export const useWishlist = () => {
  const { wishlistIds, toggleWishlist, isInWishlist, loading } = useWishlistStore();
  return { wishlistIds, toggleWishlist, isInWishlist, loading };
};
