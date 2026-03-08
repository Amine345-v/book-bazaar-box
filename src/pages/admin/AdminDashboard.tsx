import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBooks } from "@/hooks/use-books";
import { BookOpen, Users, ShoppingBag, DollarSign, TrendingUp, Star } from "lucide-react";

const AdminDashboard = () => {
  const { data: books = [] } = useBooks();

  const { data: purchases = [] } = useQuery({
    queryKey: ["admin-purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.amount), 0);
  const recentPurchases = purchases.slice(0, 5);

  const stats = [
    { icon: BookOpen, label: "Total Books", value: books.length, color: "text-primary" },
    { icon: Users, label: "Total Users", value: profiles.length, color: "text-emerald-500" },
    { icon: ShoppingBag, label: "Total Orders", value: purchases.length, color: "text-orange-500" },
    { icon: DollarSign, label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, color: "text-violet-500" },
    { icon: Star, label: "Reviews", value: reviews.length, color: "text-yellow-500" },
    { icon: TrendingUp, label: "Avg. Order", value: purchases.length > 0 ? `$${(totalRevenue / purchases.length).toFixed(2)}` : "$0", color: "text-sky-500" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-5 shadow-book border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="font-body text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-card rounded-xl p-6 shadow-book border border-border">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Recent Orders</h2>
        {recentPurchases.length === 0 ? (
          <p className="font-body text-muted-foreground text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-body text-xs text-muted-foreground uppercase pb-3">Order ID</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase pb-3">Book</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase pb-3">Amount</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase pb-3">Status</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-3 font-body text-sm text-foreground">{p.id.slice(0, 8)}...</td>
                    <td className="py-3 font-body text-sm text-foreground">{p.book_id}</td>
                    <td className="py-3 font-body text-sm font-medium text-foreground">${Number(p.amount).toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`font-body text-xs px-2 py-1 rounded-full ${
                        p.status === "completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 font-body text-sm text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
