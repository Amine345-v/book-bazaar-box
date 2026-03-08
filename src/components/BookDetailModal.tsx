import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import type { Book } from "@/data/books";

interface BookDetailModalProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (book: Book) => void;
}

const BookDetailModal = ({ book, open, onOpenChange, onAddToCart }: BookDetailModalProps) => {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-card">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-2/5 shrink-0">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-64 sm:h-full object-cover"
            />
          </div>
          <div className="p-6 sm:w-3/5 flex flex-col">
            <DialogHeader className="text-left mb-4">
              <p className="text-xs uppercase tracking-widest text-primary font-body font-semibold">
                {book.category}
              </p>
              <DialogTitle className="font-display text-2xl font-bold text-card-foreground">
                {book.title}
              </DialogTitle>
              <p className="text-muted-foreground font-body">by {book.author}</p>
            </DialogHeader>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(book.rating)
                        ? "fill-primary text-primary"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-body">
                {book.rating} ({book.reviews.toLocaleString()} reviews)
              </span>
            </div>

            <p className="text-foreground/80 font-body text-sm leading-relaxed flex-1 mb-6">
              {book.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-card-foreground">
                  ${book.price}
                </span>
                {book.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through font-body">
                    ${book.originalPrice}
                  </span>
                )}
              </div>
              <Button
                className="gap-2 font-body font-semibold"
                onClick={() => onAddToCart(book)}
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailModal;
