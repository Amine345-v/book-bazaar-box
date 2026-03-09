import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToggleWishlist } from "@/hooks/use-wishlist";
import { useTranslation } from "react-i18next";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
}

const BookCard = ({ book, onAddToCart }: BookCardProps) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useToggleWishlist();
  const { t } = useTranslation();
  const wishlisted = isInWishlist(book.id);

  return (
    <div className="group bg-card rounded-xl shadow-book hover:shadow-book-hover transition-all duration-300 overflow-hidden">
      <div
        className="relative cursor-pointer overflow-hidden"
        onClick={() => navigate(`/book/${book.id}`)}
      >
        <img
          src={book.cover}
          alt={book.title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {book.originalPrice && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-body font-bold px-2 py-1 rounded-full">
            {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
          </span>
        )}
        <button
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
            wishlisted
              ? "bg-primary text-primary-foreground"
              : "bg-card/80 text-card-foreground hover:bg-primary hover:text-primary-foreground"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book.id);
          }}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-primary font-body font-semibold mb-1">
          {book.category}
        </p>
        <h3
          className="font-display text-lg font-bold text-card-foreground leading-tight mb-1 cursor-pointer hover:text-primary transition-colors line-clamp-2"
          onClick={() => navigate(`/book/${book.id}`)}
        >
          {book.title}
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-2">{book.author}</p>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.floor(book.rating)
                  ? "fill-primary text-primary"
                  : "text-border"
              }`}
            />
          ))}
          <span className="font-body text-xs text-muted-foreground ml-1">
            ({book.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-card-foreground">
              ${book.price}
            </span>
            {book.originalPrice && (
              <span className="font-body text-sm text-muted-foreground line-through">
                ${book.originalPrice}
              </span>
            )}
          </div>

          {onAddToCart && (
            <Button
              size="sm"
              className="font-body text-xs gap-1"
              onClick={() => onAddToCart(book)}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {t("actions.addToCart")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
