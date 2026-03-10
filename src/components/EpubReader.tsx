import { useEffect, useRef, useState, useCallback } from "react";
import ePub, { Book, Rendition, NavItem } from "epubjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Bookmark,
  Highlighter,
  Search,
  Sun,
  Moon,
  Type,
  Minus,
  Plus,
  X,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  useSaveProgress,
  useBookmarks,
  useAddBookmark,
  useDeleteBookmark,
  useHighlights,
  useAddHighlight,
  useDeleteHighlight,
  useReadingProgress,
} from "@/hooks/use-reader";

interface EpubReaderProps {
  bookId: string;
  epubData: ArrayBuffer;
  onClose: () => void;
}

const FONT_SIZES = [14, 16, 18, 20, 22, 24];
const HIGHLIGHT_COLORS = ["yellow", "lime", "cyan", "pink", "orange"];

const EpubReader = ({ bookId, epubData, onClose }: EpubReaderProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);

  const [toc, setToc] = useState<NavItem[]>([]);
  const [currentCfi, setCurrentCfi] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectedCfiRange, setSelectedCfiRange] = useState("");
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);

  const { data: savedProgress } = useReadingProgress(bookId);
  const { mutate: saveProgress } = useSaveProgress();
  const { data: bookmarks = [] } = useBookmarks(bookId);
  const { mutate: addBookmark } = useAddBookmark();
  const { mutate: deleteBookmark } = useDeleteBookmark();
  const { data: highlights = [] } = useHighlights(bookId);
  const { mutate: addHighlight } = useAddHighlight();
  const { mutate: deleteHighlight } = useDeleteHighlight();

  // Initialize book
  useEffect(() => {
    if (!viewerRef.current || !epubData) return;

    const book = ePub(epubData);
    bookRef.current = book;

    const rendition = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      spread: "none",
      flow: "paginated",
    });

    renditionRef.current = rendition;

    // Apply theme
    rendition.themes.register("light", {
      body: {
        color: "hsl(20, 10%, 12%)",
        background: "hsl(40, 33%, 96%)",
        "font-family": "'Source Sans 3', system-ui, sans-serif",
      },
    });
    rendition.themes.register("dark", {
      body: {
        color: "hsl(40, 33%, 96%)",
        background: "hsl(20, 10%, 12%)",
        "font-family": "'Source Sans 3', system-ui, sans-serif",
      },
    });
    rendition.themes.select(isDark ? "dark" : "light");
    rendition.themes.fontSize(`${fontSize}px`);

    // Load TOC
    book.loaded.navigation.then((nav) => {
      setToc(nav.toc);
    });

    // Restore position or start
    const startCfi = savedProgress?.cfi_position;
    rendition.display(startCfi || undefined);

    // Track location changes
    rendition.on("locationChanged", (location: any) => {
      const cfi = location.start?.cfi || location.start;
      if (cfi) setCurrentCfi(cfi);

      if (book.locations.length()) {
        const pct = book.locations.percentageFromCfi(cfi);
        setPercentage(Math.round(pct * 100));
      }
    });

    // Generate locations for progress tracking
    book.ready.then(() => {
      return book.locations.generate(1600);
    }).then((locations) => {
      setTotalPages(locations.length);
    });

    // Text selection for highlighting
    rendition.on("selected", (cfiRange: string, contents: any) => {
      const text = rendition.getRange(cfiRange)?.toString() || "";
      if (text.trim()) {
        setSelectedText(text);
        setSelectedCfiRange(cfiRange);
        setShowHighlightMenu(true);
      }
    });

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") rendition.prev();
      if (e.key === "ArrowRight") rendition.next();
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    rendition.on("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      book.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epubData]);

  // Apply highlights from DB
  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition || !highlights.length) return;

    highlights.forEach((h) => {
      try {
        rendition.annotations.highlight(
          h.cfi_range,
          {},
          undefined,
          undefined,
          { fill: h.color, "fill-opacity": "0.3" }
        );
      } catch {
        // cfi may not be in current chapter
      }
    });
  }, [highlights]);

  // Theme/font updates
  useEffect(() => {
    const r = renditionRef.current;
    if (!r) return;
    r.themes.select(isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const r = renditionRef.current;
    if (!r) return;
    r.themes.fontSize(`${fontSize}px`);
  }, [fontSize]);

  // Auto-save progress debounced
  useEffect(() => {
    if (!currentCfi || !bookId) return;
    const timer = setTimeout(() => {
      saveProgress({ bookId, cfiPosition: currentCfi, percentage });
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentCfi, percentage, bookId, saveProgress]);

  const goNext = useCallback(() => renditionRef.current?.next(), []);
  const goPrev = useCallback(() => renditionRef.current?.prev(), []);

  const goToLocation = useCallback((href: string) => {
    renditionRef.current?.display(href);
  }, []);

  const handleAddBookmark = useCallback(() => {
    if (!currentCfi) return;
    addBookmark({ bookId, cfiPosition: currentCfi, label: `Page at ${percentage}%` });
  }, [addBookmark, bookId, currentCfi, percentage]);

  const handleHighlight = useCallback(
    (color: string) => {
      if (!selectedCfiRange || !selectedText) return;
      addHighlight({
        bookId,
        cfiRange: selectedCfiRange,
        text: selectedText,
        color,
      });
      renditionRef.current?.annotations.highlight(
        selectedCfiRange,
        {},
        undefined,
        undefined,
        { fill: color, "fill-opacity": "0.3" }
      );
      setShowHighlightMenu(false);
      setSelectedText("");
    },
    [addHighlight, bookId, selectedCfiRange, selectedText]
  );

  const handleSearch = useCallback(async () => {
    if (!bookRef.current || !searchQuery.trim()) return;
    const book = bookRef.current;
    const results: any[] = [];

    const spine = book.spine as any;
    for (const item of spine.items || spine.spineItems || []) {
      try {
        const doc = await item.load(book.load.bind(book));
        const text = doc?.documentElement?.textContent || "";
        const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase());
        if (idx > -1) {
          const excerpt = text.substring(Math.max(0, idx - 40), idx + searchQuery.length + 40);
          results.push({
            cfi: item.cfiFromElement?.(doc.documentElement) || item.href,
            href: item.href,
            excerpt: `...${excerpt}...`,
          });
        }
      } catch {
        // skip unreachable sections
      }
    }
    setSearchResults(results);
  }, [searchQuery]);

  const fontSizeIndex = FONT_SIZES.indexOf(fontSize);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${
        isDark ? "bg-[hsl(20,10%,12%)]" : "bg-background"
      }`}
    >
      {/* Top bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b ${
          isDark ? "border-muted bg-[hsl(20,10%,16%)]" : "border-border bg-card"
        }`}
      >
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
          <BookOpen className="h-5 w-5 text-primary" />
          <span className={`font-body text-sm ${isDark ? "text-muted-foreground" : "text-foreground"}`}>
            {percentage}% · Reading
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Font size */}
          <Button
            variant="ghost"
            size="icon"
            disabled={fontSizeIndex <= 0}
            onClick={() => setFontSize(FONT_SIZES[fontSizeIndex - 1])}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className={`font-body text-xs w-6 text-center ${isDark ? "text-muted-foreground" : ""}`}>
            {fontSize}
          </span>
          <Button
            variant="ghost"
            size="icon"
            disabled={fontSizeIndex >= FONT_SIZES.length - 1}
            onClick={() => setFontSize(FONT_SIZES[fontSizeIndex + 1])}
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Bookmark */}
          <Button variant="ghost" size="icon" onClick={handleAddBookmark}>
            <Bookmark className="h-4 w-4" />
          </Button>

          {/* TOC Panel */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <List className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="font-display">Table of Contents</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-120px)] mt-4">
                <div className="space-y-1">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-body hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => goToLocation(item.href)}
                    >
                      {item.label.trim()}
                    </button>
                  ))}
                </div>

                <Separator className="my-4" />
                <h3 className="font-display text-sm font-semibold mb-2 px-3">
                  Bookmarks ({bookmarks.length})
                </h3>
                <div className="space-y-1">
                  {bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent group"
                    >
                      <button
                        className="flex-1 text-left text-sm font-body"
                        onClick={() => goToLocation(bm.cfi_position)}
                      >
                        {bm.label}
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => deleteBookmark({ id: bm.id, bookId })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
                <h3 className="font-display text-sm font-semibold mb-2 px-3">
                  <Highlighter className="h-4 w-4 inline mr-1" />
                  Highlights ({highlights.length})
                </h3>
                <div className="space-y-2 px-3">
                  {highlights.map((h) => (
                    <div
                      key={h.id}
                      className="p-2 rounded border text-xs font-body group relative cursor-pointer"
                      style={{ borderLeftColor: h.color, borderLeftWidth: 3 }}
                      onClick={() => goToLocation(h.cfi_range)}
                    >
                      <p className="line-clamp-2">{h.text}</p>
                      {h.note && (
                        <p className="text-muted-foreground mt-1 italic">{h.note}</p>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHighlight({ id: h.id, bookId });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className={`px-4 py-2 border-b flex gap-2 ${isDark ? "border-muted bg-[hsl(20,10%,16%)]" : "border-border bg-card"}`}>
          <Input
            placeholder="Search in book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="font-body text-sm"
          />
          <Button size="sm" onClick={handleSearch} className="font-body">
            Search
          </Button>
          {searchResults.length > 0 && (
            <ScrollArea className="absolute top-[100px] left-4 right-4 max-h-60 bg-popover border rounded-md shadow-lg z-10 p-2">
              {searchResults.map((r, i) => (
                <button
                  key={i}
                  className="w-full text-left p-2 text-xs font-body hover:bg-accent rounded"
                  onClick={() => {
                    goToLocation(r.href);
                    setShowSearch(false);
                    setSearchResults([]);
                  }}
                >
                  {r.excerpt}
                </button>
              ))}
            </ScrollArea>
          )}
        </div>
      )}

      {/* Highlight color picker */}
      {showHighlightMenu && (
        <div className={`px-4 py-2 border-b flex items-center gap-2 ${isDark ? "border-muted bg-[hsl(20,10%,16%)]" : "border-border bg-card"}`}>
          <span className="font-body text-xs text-muted-foreground">Highlight:</span>
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c}
              className="w-6 h-6 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
              style={{ backgroundColor: c }}
              onClick={() => handleHighlight(c)}
            />
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-auto"
            onClick={() => setShowHighlightMenu(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Reader area */}
      <div className="flex-1 relative overflow-hidden">
        <div ref={viewerRef} className="h-full w-full" />

        {/* Nav arrows */}
        <button
          className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          onClick={goPrev}
        >
          <ChevronLeft className={`h-8 w-8 ${isDark ? "text-muted-foreground" : "text-foreground/30"}`} />
        </button>
        <button
          className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          onClick={goNext}
        >
          <ChevronRight className={`h-8 w-8 ${isDark ? "text-muted-foreground" : "text-foreground/30"}`} />
        </button>
      </div>

      {/* Progress bar */}
      <div className={`px-4 py-2 border-t ${isDark ? "border-muted bg-[hsl(20,10%,16%)]" : "border-border bg-card"}`}>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EpubReader;
