import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const AdminOrders = () => {
  const [search, setSearch] = useState("");

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["admin-all-purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: profilesMap = {} } = useQuery({
    queryKey: ["admin-profiles-map"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("user_id, display_name");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data || []).forEach((p) => { map[p.user_id] = p.display_name || "Unknown"; });
      return map;
    },
  });

  const { data: booksMap = {} } = useQuery({
    queryKey: ["admin-books-map"],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("id, title");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data || []).forEach((b) => { map[b.id] = b.title; });
      return map;
    },
  });

  const filtered = purchases.filter((p) => {
    const bookTitle = booksMap[p.book_id] || p.book_id;
    const userName = profilesMap[p.user_id] || "";
    const q = search.toLowerCase();
    return bookTitle.toLowerCase().includes(q) || userName.toLowerCase().includes(q) || p.id.includes(q);
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Orders</h1>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 font-body" />
      </div>

      {isLoading ? (
        <p className="font-body text-muted-foreground">Loading...</p>
      ) : (
        <div className="bg-card rounded-xl shadow-book border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Order ID</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Customer</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Book</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Amount</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Status</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center font-body text-muted-foreground">No orders found</td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/10">
                      <td className="p-4 font-body text-sm text-foreground font-mono">{p.id.slice(0, 8)}...</td>
                      <td className="p-4 font-body text-sm text-foreground">{profilesMap[p.user_id] || "Unknown"}</td>
                      <td className="p-4 font-body text-sm text-foreground">{booksMap[p.book_id] || p.book_id}</td>
                      <td className="p-4 font-body text-sm font-medium text-foreground">${Number(p.amount).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`font-body text-xs px-2 py-1 rounded-full ${
                          p.status === "completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-yellow-500/10 text-yellow-600"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 font-body text-sm text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
