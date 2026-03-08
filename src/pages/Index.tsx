import { useState, useMemo } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import CategoryFilter from "@/components/CategoryFilter";
import BookCard from "@/components/BookCard";
import BookDetailModal from "@/components/BookDetailModal";
import { books, type Book } from "@/data/books";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesCategory =
        activeCategory === "All" || book.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleAddToCart = (book: Book) => {
    setCart((prev) => [...prev, book]);
    toast.success(`"${book.title}" added to cart`, {
      description: `$${book.price}`,
    });
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        cartCount={cart.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <HeroBanner />

      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Browse Ebooks
          </h2>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-muted-foreground">
              No books found
            </p>
            <p className="font-body text-muted-foreground mt-2">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={handleAddToCart}
                onSelect={handleSelectBook}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t bg-card py-8 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p className="font-body text-sm text-muted-foreground">
            © 2026 PageTurn. All rights reserved.
          </p>
        </div>
      </footer>

      <BookDetailModal
        book={selectedBook}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Index;
