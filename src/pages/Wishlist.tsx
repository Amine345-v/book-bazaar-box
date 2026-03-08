import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks } from "@/hooks/use-books";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlistIds } = useWishlist();
  const { addToCart } = useCart();
  const { data: books = [] } = useBooks();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Sign In to View Wishlist</h1>
          <p className="font-body text-muted-foreground mb-6">Create an account to save your favorite books</p>
          <Button className="font-body font-semibold" onClick={() => navigate("/auth")}>Sign In</Button>
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
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">My Wishlist</h1>
        <p className="font-body text-muted-foreground mb-8">{wishlistBooks.length} book{wishlistBooks.length !== 1 ? "s" : ""} saved</p>

        {wishlistBooks.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-display text-2xl text-muted-foreground">Your wishlist is empty</p>
            <p className="font-body text-muted-foreground mt-2">Browse our collection and save books you love</p>
            <Button className="mt-4 font-body" onClick={() => navigate("/browse")}>Browse Books</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
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
