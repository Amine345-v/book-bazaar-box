// Lovable-specific integration removed during Replit migration.
// OAuth social sign-in (Google/Apple) via Lovable Cloud Auth is no longer available.
// Use email/password authentication via Supabase instead.
export const lovable = {
  auth: {
    signInWithOAuth: async (_provider: "google" | "apple") => {
      return { error: new Error("OAuth sign-in is not available on this platform.") };
    },
  },
};
