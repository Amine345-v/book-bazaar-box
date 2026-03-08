import { useBooks } from "@/hooks/use-books";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  const { data: books = [] } = useBooks();
  const { t } = useTranslation();

  // Derive categories dynamically from the (already-translated) book data
  const categories = useMemo(() => {
    const unique = Array.from(new Set(books.map((b) => b.category))).sort();
    return ["All", ...unique];
  }, [books]);

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 ${
            activeCategory === category
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {category === "All" ? t("browse.all", "All") : category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
