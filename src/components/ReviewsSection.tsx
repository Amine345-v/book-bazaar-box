import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Review = {
  id: string;
  user_id: string;
  book_id: string;
  rating: number;
  title: string;
  content: string | null;
  created_at: string;
  display_name: string | null;
};

interface ReviewsSectionProps {
  bookId: string;
}

const StarRating = ({
  value,
  hover,
  onHover,
  onLeave,
  onClick,
  size = "h-6 w-6",
}: {
  value: number;
  hover: number;
  onHover: (v: number) => void;
  onLeave: () => void;
  onClick: (v: number) => void;
  size?: string;
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onMouseEnter={() => onHover(star)}
        onMouseLeave={onLeave}
        onClick={() => onClick(star)}
      >
        <Star
          className={`${size} transition-colors ${
            star <= (hover || value) ? "fill-primary text-primary" : "text-border"
          }`}
        />
      </button>
    ))}
  </div>
);

const ReviewsSection = ({ bookId }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("id, user_id, book_id, rating, title, content, created_at")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false });

    if (reviewsData && reviewsData.length > 0) {
      const userIds = [...new Set(reviewsData.map((r) => r.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", userIds);

      const profileMap = new Map(
        (profilesData || []).map((p) => [p.user_id, p.display_name])
      );

      setReviews(
        reviewsData.map((r) => ({
          id: r.id,
          user_id: r.user_id,
          book_id: r.book_id,
          rating: r.rating,
          title: r.title,
          content: r.content,
          created_at: r.created_at,
          display_name: profileMap.get(r.user_id) || null,
        }))
      );
    } else {
      setReviews([]);
    }
    setLoading(false);
  }, [bookId]);

  useEffect(() => {
    fetchReviews();
    const channel = supabase
      .channel(`reviews-${bookId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews", filter: `book_id=eq.${bookId}` }, () => fetchReviews())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [bookId, fetchReviews]);

  const userHasReviewed = reviews.some((r) => r.user_id === user?.id);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setRating(5);
    setHoverRating(0);
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setTitle(review.title);
    setContent(review.content || "");
    setRating(review.rating);
    setShowForm(true);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) toast.error(error.message);
    else toast.success("Review deleted");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please sign in to leave a review"); return; }
    if (!title.trim()) { toast.error("Please add a title"); return; }
    setSubmitting(true);

    if (editingId) {
      const { error } = await supabase.from("reviews").update({
        rating,
        title: title.trim(),
        content: content.trim() || null,
      }).eq("id", editingId);
      if (error) toast.error(error.message);
      else { toast.success("Review updated!"); resetForm(); }
    } else {
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        book_id: bookId,
        rating,
        title: title.trim(),
        content: content.trim() || null,
      });
      if (error) toast.error(error.message);
      else { toast.success("Review submitted!"); resetForm(); }
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Reviews ({reviews.length})
          </h2>
          {avgRating && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(Number(avgRating)) ? "fill-primary text-primary" : "text-border"}`} />
                ))}
              </div>
              <span className="font-body text-sm text-muted-foreground">{avgRating} average</span>
            </div>
          )}
        </div>
        {user && !userHasReviewed && !showForm && (
          <Button variant="outline" className="font-body" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 shadow-book border border-border mb-6">
          <h3 className="font-display text-lg font-semibold text-card-foreground mb-4">
            {editingId ? "Edit Your Review" : "Your Review"}
          </h3>
          <div className="mb-4">
            <p className="font-body text-sm text-muted-foreground mb-2">Rating</p>
            <StarRating value={rating} hover={hoverRating} onHover={setHoverRating} onLeave={() => setHoverRating(0)} onClick={setRating} />
          </div>
          <div className="mb-4">
            <Input placeholder="Review title" value={title} onChange={(e) => setTitle(e.target.value)} className="font-body" maxLength={200} required />
          </div>
          <div className="mb-4">
            <Textarea placeholder="Share your thoughts about this book... (optional)" value={content} onChange={(e) => setContent(e.target.value)} className="font-body min-h-[100px]" maxLength={2000} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="font-body font-semibold" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update Review" : "Submit Review"}
            </Button>
            <Button type="button" variant="ghost" className="font-body" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="font-body text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-xl border border-border">
          <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-body text-muted-foreground">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl p-5 shadow-book">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-xs">
                    {(review.display_name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-card-foreground">{review.display_name || "Anonymous"}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-border"}`} />
                    ))}
                  </div>
                  {user?.id === review.user_id && !showForm && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(review)}>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(review.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <h4 className="font-display font-semibold text-card-foreground mb-1">{review.title}</h4>
              {review.content && (
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{review.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
