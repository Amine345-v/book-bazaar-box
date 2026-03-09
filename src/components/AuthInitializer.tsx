import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useWishlistStore } from "@/stores/wishlist-store";

/**
 * Initializes auth listener and syncs wishlist on user change.
 * Renders nothing — just a side-effect component.
 */
const AuthInitializer = () => {
  const init = useAuthStore((s) => s.init);
  const user = useAuthStore((s) => s.user);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const resetWishlist = useWishlistStore((s) => s.reset);

  useEffect(() => {
    const unsub = init();
    return unsub;
  }, [init]);

  useEffect(() => {
    if (user) {
      fetchWishlist(user.id);
    } else {
      resetWishlist();
    }
  }, [user, fetchWishlist, resetWishlist]);

  return null;
};

export default AuthInitializer;
