import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type WishlistContextType = {
  wishlistIds: Set<string>;
  toggleWishlist: (bookId: string) => Promise<void>;
  isInWishlist: (bookId: string) => boolean;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setWishlistIds(new Set());
      return;
    }
    const fetchWishlist = async () => {
      const { data } = await supabase
        .from("wishlists")
        .select("book_id")
        .eq("user_id", user.id);
      if (data) {
        setWishlistIds(new Set(data.map((w) => w.book_id)));
      }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = useCallback(async (bookId: string) => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    setLoading(true);
    if (wishlistIds.has(bookId)) {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId);
      if (!error) {
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(bookId);
          return next;
        });
        toast.info("Removed from wishlist");
      }
    } else {
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, book_id: bookId });
      if (!error) {
        setWishlistIds((prev) => new Set(prev).add(bookId));
        toast.success("Added to wishlist!");
      }
    }
    setLoading(false);
  }, [user, wishlistIds]);

  const isInWishlist = useCallback((bookId: string) => wishlistIds.has(bookId), [wishlistIds]);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
