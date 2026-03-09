import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/stores/auth-store";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useBooks } from "@/hooks/use-books";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Purchase = {
  id: string;
  book_id: string;
  amount: number;
  status: string;
  created_at: string;
};

const Purchases = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { data: books = [] } = useBooks();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchPurchases = async () => {
      const { data } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setPurchases(data);
      setLoading(false);
    };
    fetchPurchases();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Sign In to View Purchases</h1>
          <Button className="mt-4 font-body font-semibold" onClick={() => navigate("/auth")}>Sign In</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">My Purchases</h1>

        {loading ? (
          <p className="font-body text-muted-foreground">Loading...</p>
        ) : purchases.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-display text-2xl text-muted-foreground">No purchases yet</p>
            <Button className="mt-4 font-body" onClick={() => navigate("/browse")}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => {
              const book = books.find((b) => b.id === purchase.book_id);
              return (
                <div key={purchase.id} className="flex gap-4 bg-card rounded-xl p-4 shadow-book">
                  {book && (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-lg cursor-pointer shrink-0"
                      onClick={() => navigate(`/book/${book.id}`)}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-card-foreground">
                      {book?.title || `Book #${purchase.book_id}`}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground">{book?.author}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-body text-sm text-muted-foreground">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-display font-bold text-card-foreground">${purchase.amount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Purchases;
