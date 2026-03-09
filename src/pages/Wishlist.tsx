import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { useToggleWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/stores/cart-store";
import { useAuth } from "@/stores/auth-store";
import { useBooks } from "@/hooks/use-books";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlistIds } = useToggleWishlist();
  const { addToCart } = useCart();
  const { data: books = [] } = useBooks();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Sign in to view your Wishlist</h1>
          <button className="mt-4 font-body font-semibold text-primary" onClick={() => navigate("/auth")}>Sign In</button>
        </main>
        <Footer />
      </div>
    );
  }

  const wishlistBooks = books.filter((b) => wishlistIds.has(b.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">My Wishlist</h1>

        {wishlistBooks.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-display text-2xl text-muted-foreground">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wishlistBooks.map((book) => (
              <BookCard key={book.id} book={book} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
