import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
}

const BookCard = ({ book, onAddToCart }: BookCardProps) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(book.id);

  return (
    <div
      className="group cursor-pointer rounded-lg bg-card p-3 transition-all duration-300 hover:-translate-y-1 shadow-book hover:shadow-book-hover"
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md mb-3">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {book.originalPrice && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-body font-bold px-2 py-1 rounded-full">
            {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
          </span>
        )}
        {book.newArrival && (
          <span className="absolute top-2 right-2 bg-foreground text-background text-xs font-body font-bold px-2 py-1 rounded-full">
            NEW
          </span>
        )}
        <button
          className={`absolute bottom-2 right-2 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted
              ? "bg-primary text-primary-foreground"
              : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book.id);
          }}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-semibold leading-tight line-clamp-1 text-card-foreground">
          {book.title}
        </h3>
        <p className="text-muted-foreground font-body text-sm">{book.author}</p>

        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-sm font-body font-medium text-card-foreground">
            {book.rating}
          </span>
          <span className="text-xs text-muted-foreground font-body">
            ({book.reviews.toLocaleString()})
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-card-foreground">
              ${book.price}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-muted-foreground line-through font-body">
                ${book.originalPrice}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(book);
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
