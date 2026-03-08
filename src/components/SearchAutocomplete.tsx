import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { books } from "@/data/books";

const SearchAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = query.length >= 2
    ? books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(query.toLowerCase()) ||
            b.author.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (bookId: string) => {
    setOpen(false);
    setQuery("");
    navigate(`/book/${bookId}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search books, authors..."
        className="pl-10 bg-secondary/50 border-border font-body"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.length >= 2 && setOpen(true)}
      />
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-book z-50 overflow-hidden">
          {suggestions.map((book) => (
            <button
              key={book.id}
              onClick={() => handleSelect(book.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/50 transition-colors text-left"
            >
              <img
                src={book.cover}
                alt={book.title}
                className="h-10 w-7 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="font-body text-sm font-medium text-foreground truncate">
                  {book.title}
                </p>
                <p className="font-body text-xs text-muted-foreground truncate">
                  {book.author} · {book.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
