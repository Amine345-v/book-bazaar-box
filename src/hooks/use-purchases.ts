import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth-store";

export type Purchase = {
  id: string;
  book_id: string;
  amount: number;
  status: string;
  created_at: string;
};

export function usePurchases() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ["purchases", user?.id],
    queryFn: async () => {
      if (!user) return [] as Purchase[];
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Purchase[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });
}
