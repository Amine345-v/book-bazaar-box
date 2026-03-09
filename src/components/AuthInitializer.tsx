import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Initializes the Supabase auth listener.
 * Renders nothing — just a side-effect component.
 */
const AuthInitializer = () => {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    const unsub = init();
    return unsub;
  }, [init]);

  return null;
};

export default AuthInitializer;
