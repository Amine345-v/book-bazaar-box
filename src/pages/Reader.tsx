import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/stores/auth-store";
import { useEpubData } from "@/hooks/use-reader";
import { useBook } from "@/hooks/use-books";
import { usePurchases } from "@/hooks/use-purchases";
import EpubReader from "@/components/EpubReader";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { data: purchases = [] } = usePurchases();
  const { book } = useBook(id);

  const previewParam = new URLSearchParams(location.search).get("preview");
  const preview = previewParam === "1" || previewParam?.toLowerCase() === "true";
  const hasPurchased = user && book && purchases.some((p) => p.book_id === book.id && p.status === "completed");
  const canRead = hasPurchased || preview;

  console.log("Reader preview", { id, previewParam, preview, hasPurchased, canRead });

  const { data: epubData, isLoading, error } = useEpubData(id, preview);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Sign in Required</h1>
          <p className="font-body text-muted-foreground mb-4">
            You need to be signed in to read ebooks.
          </p>
          <Button onClick={() => navigate("/auth")} className="font-body">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="font-body text-muted-foreground">Loading your book...</p>
        </div>
      </div>
    );
  }

  if (!canRead) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Lock className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="font-body text-muted-foreground mb-4">
            You need to purchase this book to get full access. Preview the first chapter for free.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/read/${id}?preview=1`)} className="font-body">
              Read Preview
            </Button>
            <Button onClick={() => navigate(`/book/${id}`)} className="font-body">
              View Book
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !epubData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Lock className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="font-body text-muted-foreground mb-4">
            {(error as Error)?.message || "Unable to load book data."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/book/${id}`)} className="font-body">
              View Book
            </Button>
            <Button variant="outline" onClick={() => navigate("/library")} className="font-body">
              My Library
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EpubReader
      bookId={id!}
      epubData={epubData}
      onClose={() => navigate("/library")}
      preview={preview}
    />
  );
};

export default Reader;
