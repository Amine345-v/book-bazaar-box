import BookCard from "@/components/BookCard";
import { useCart } from "@/stores/cart-store";
import type { Book } from "@/types/book";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface BookSectionProps {
  title: string;
  subtitle?: string;
  books: Book[];
  showViewAll?: boolean;
}

const BookSection = ({ title, subtitle, books, showViewAll }: BookSectionProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="font-body text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {showViewAll && (
          <Button
            variant="ghost"
            className="font-body text-primary gap-1"
            onClick={() => navigate("/browse")}
          >
            {t("sections.viewAll")} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onAddToCart={addToCart} />
        ))}
      </div>
    </section>
  );
};

export default BookSection;
