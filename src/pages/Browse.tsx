import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryFilter from "@/components/CategoryFilter";
import BookCard from "@/components/BookCard";
import { books } from "@/data/books";
import { useCart } from "@/contexts/CartContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "rating" | "price-low" | "price-high" | "date-newest" | "date-oldest";

const sortLabels: Record<SortOption, string> = {
  "rating": "Highest Rated",
  "price-low": "Price: Low → High",
  "price-high": "Price: High → Low",
  "date-newest": "Newest First",
  "date-oldest": "Oldest First",
};

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const { addToCart } = useCart();

  const filteredBooks = useMemo(() => {
    const filtered = books.filter((book) => {
      const matchesCategory = activeCategory === "All" || book.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "date-newest":
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case "date-oldest":
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        default:
          return 0;
      }
    });
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Browse Ebooks
          </h1>
          <p className="font-body text-muted-foreground">
            Explore our complete collection of {books.length} titles
          </p>
        </div>

        <div className="mb-8">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-muted-foreground">No books found</p>
            <p className="font-body text-muted-foreground mt-2">
              Try a different search or category
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-sm text-muted-foreground">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[180px] font-body text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(sortLabels) as [SortOption, string][]).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="font-body text-sm">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} onAddToCart={addToCart} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
