import { useNavigate } from "react-router-dom";
import { BookOpen, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/stores/auth-store";
import { usePurchases } from "@/hooks/use-purchases";
import { useBooks } from "@/hooks/use-books";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function useAllReadingProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["all-reading-progress"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

const Library = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: purchases = [], isLoading: loadingPurchases } = usePurchases();
  const { data: books = [] } = useBooks();
  const { data: progressList = [] } = useAllReadingProgress();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Your Library</h1>
          <p className="font-body text-muted-foreground mb-6">Sign in to access your ebook library.</p>
          <Button onClick={() => navigate("/auth")} className="font-body font-semibold">
            Sign In
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const purchasedBooks = purchases
    .filter((p) => p.status === "completed")
    .map((p) => {
      const book = books.find((b) => b.id === p.book_id);
      const progress = progressList.find((pr) => pr.book_id === p.book_id);
      return { purchase: p, book, progress };
    })
    .filter((item) => item.book);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">My Library</h1>
        </div>

        {loadingPurchases ? (
          <p className="font-body text-muted-foreground">Loading your library...</p>
        ) : purchasedBooks.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              No books yet
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              Browse our collection and purchase your first ebook!
            </p>
            <Button onClick={() => navigate("/browse")} className="font-body font-semibold">
              Browse Books
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {purchasedBooks.map(({ book, progress }) => (
              <div
                key={book!.id}
                className="group bg-card rounded-xl shadow-book hover:shadow-book-hover transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/read/${book!.id}`)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={book!.cover}
                    alt={book!.title}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <Button size="sm" className="font-body gap-1 w-full">
                      <BookOpen className="h-4 w-4" />
                      {progress && progress.percentage > 0 ? "Continue Reading" : "Start Reading"}
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-display text-sm font-bold text-card-foreground line-clamp-2 mb-1">
                    {book!.title}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mb-2">{book!.author}</p>
                  {progress && progress.percentage > 0 && (
                    <div className="space-y-1">
                      <Progress value={progress.percentage} className="h-1.5" />
                      <p className="font-body text-xs text-muted-foreground text-right">
                        {progress.percentage}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Library;
