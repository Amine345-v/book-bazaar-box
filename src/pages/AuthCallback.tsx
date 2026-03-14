import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);

    // Provider returned an error (e.g. user denied access)
    const oauthError = url.searchParams.get("error");
    const oauthErrorDesc = url.searchParams.get("error_description");
    if (oauthError) {
      const msg = oauthErrorDesc || oauthError;
      setError(msg);
      toast.error(msg);
      setTimeout(() => navigate("/auth", { replace: true }), 2000);
      return;
    }

    const code = url.searchParams.get("code");
    if (!code) {
      navigate("/auth", { replace: true });
      return;
    }

    supabase.auth.exchangeCodeForSession(window.location.href).then(({ data, error: exchangeError }) => {
      if (exchangeError) {
        const msg = exchangeError.message || "Sign-in failed. Please try again.";
        setError(msg);
        toast.error(msg);
        setTimeout(() => navigate("/auth", { replace: true }), 2000);
        return;
      }

      if (data.session) {
        // Directly push session into the auth store — don't wait for onAuthStateChange
        useAuthStore.setState({
          session: data.session,
          user: data.session.user,
          loading: false,
        });
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/", { replace: true });
      } else {
        // Exchange returned no error and no session — unexpected
        setError("Sign-in did not return a session. Please try again.");
        setTimeout(() => navigate("/auth", { replace: true }), 2000);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <p className="font-body text-destructive mb-2">{error}</p>
          <p className="font-body text-sm text-muted-foreground">Redirecting back to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
        <p className="font-body text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;
