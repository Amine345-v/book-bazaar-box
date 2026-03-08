import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryFilter from "@/components/CategoryFilter";
import BookCard from "@/components/BookCard";
import { books } from "@/data/books";
import { useCart } from "@/contexts/CartContext";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart } = useCart();

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory = activeCategory === "All" || book.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

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
            <p className="font-body text-sm text-muted-foreground mb-4">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
            </p>
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
