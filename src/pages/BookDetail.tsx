import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft, BookOpen, Globe, FileText, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookSection from "@/components/BookSection";
import ReviewsSection from "@/components/ReviewsSection";
import { useBook } from "@/hooks/use-books";
import { useCart } from "@/stores/cart-store";
import { useToggleWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/stores/auth-store";
import { usePurchases } from "@/hooks/use-purchases";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useToggleWishlist();
  const { user } = useAuth();
  const { data: purchases = [] } = usePurchases();
  const { book, books = [], isLoading } = useBook(id);

  const hasPurchased = user && book && purchases.some(
    (p) => p.book_id === book.id && p.status === "completed"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="font-body text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Book not found</h1>
          <Button className="mt-4 font-body" onClick={() => navigate("/")}>Go Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const wishlisted = isInWishlist(book.id);
  const relatedBooks = books.filter((b) => b.category === book.category && b.id !== book.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="font-body gap-2 mb-6 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <div className="grid md:grid-cols-[350px_1fr] gap-10">
          <div>
            <div className="relative rounded-xl overflow-hidden shadow-book-hover">
              <img src={book.cover} alt={book.title} className="w-full aspect-[2/3] object-cover" />
              {book.originalPrice && (
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-sm font-body font-bold px-3 py-1 rounded-full">
                  {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-primary font-body font-semibold mb-2">{book.category}</span>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">{book.title}</h1>
            <p className="font-body text-lg text-muted-foreground mb-4">by {book.author}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(book.rating) ? "fill-primary text-primary" : "text-border"}`} />
                ))}
              </div>
              <span className="font-body text-sm text-muted-foreground">
                {book.rating} · {book.reviews.toLocaleString()} reviews
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl font-bold text-foreground">${book.price}</span>
              {book.originalPrice && (
                <span className="font-body text-xl text-muted-foreground line-through">${book.originalPrice}</span>
              )}
            </div>

            <p className="font-body text-foreground/80 leading-relaxed mb-8 max-w-2xl">{book.description}</p>

            <div className="flex gap-3 mb-8">
              <Button size="lg" className="font-body font-semibold gap-2" onClick={() => addToCart(book)}>
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`font-body font-semibold gap-2 ${wishlisted ? "border-primary text-primary" : ""}`}
                onClick={() => toggleWishlist(book.id)}
              >
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary" : ""}`} />
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>

            <Separator className="mb-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, label: "Pages", value: book.pages.toString() },
                { icon: Globe, label: "Language", value: book.language },
                { icon: FileText, label: "Format", value: book.format },
                { icon: Calendar, label: "Published", value: new Date(book.publishDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
              ].map((detail) => (
                <div key={detail.label} className="flex items-start gap-2">
                  <detail.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground">{detail.label}</p>
                    <p className="font-body text-sm font-medium text-foreground">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ReviewsSection bookId={book.id} />

        {relatedBooks.length > 0 && (
          <div className="mt-16">
            <BookSection title="You Might Also Like" subtitle={`More ${book.category} books`} books={relatedBooks} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookDetail;
