import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: adminRoles = [] } = useQuery({
    queryKey: ["admin-roles-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: purchaseCounts = {} } = useQuery({
    queryKey: ["admin-user-purchase-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("purchases").select("user_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((p) => { counts[p.user_id] = (counts[p.user_id] || 0) + 1; });
      return counts;
    },
  });

  const isUserAdmin = (userId: string) => adminRoles.some((r) => r.user_id === userId && r.role === "admin");

  const toggleAdmin = async (userId: string) => {
    if (isUserAdmin(userId)) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
      if (error) { toast.error(error.message); return; }
      toast.success("Admin role removed");
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) { toast.error(error.message); return; }
      toast.success("Admin role granted");
    }
    queryClient.invalidateQueries({ queryKey: ["admin-roles-list"] });
  };

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return (p.display_name || "").toLowerCase().includes(q) || p.user_id.includes(q);
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Users</h1>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 font-body" />
      </div>

      {isLoading ? (
        <p className="font-body text-muted-foreground">Loading...</p>
      ) : (
        <div className="bg-card rounded-xl shadow-book border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">User</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">User ID</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Purchases</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Role</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Joined</th>
                  <th className="text-right font-body text-xs text-muted-foreground uppercase p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center font-body text-muted-foreground">No users found</td>
                  </tr>
                ) : (
                  filtered.map((profile) => {
                    const admin = isUserAdmin(profile.user_id);
                    return (
                      <tr key={profile.id} className="border-b last:border-0 hover:bg-secondary/10">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm">
                              {(profile.display_name || "U").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-body text-sm font-medium text-foreground">{profile.display_name || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="p-4 font-body text-xs text-muted-foreground font-mono">{profile.user_id.slice(0, 12)}...</td>
                        <td className="p-4 font-body text-sm text-foreground">{purchaseCounts[profile.user_id] || 0}</td>
                        <td className="p-4">
                          {admin ? (
                            <span className="font-body text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Admin</span>
                          ) : (
                            <span className="font-body text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">User</span>
                          )}
                        </td>
                        <td className="p-4 font-body text-sm text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`font-body text-xs gap-1.5 ${admin ? "text-destructive" : "text-primary"}`}
                            onClick={() => toggleAdmin(profile.user_id)}
                          >
                            {admin ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                            {admin ? "Remove Admin" : "Make Admin"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
