import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";

// ── Reading Progress ──
export function useReadingProgress(bookId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reading-progress", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("*")
        .eq("user_id", user!.id)
        .eq("book_id", bookId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!bookId,
  });
}

export function useSaveProgress() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      bookId,
      cfiPosition,
      percentage,
    }: {
      bookId: string;
      cfiPosition: string;
      percentage: number;
    }) => {
      const { error } = await supabase.from("reading_progress").upsert(
        {
          user_id: user!.id,
          book_id: bookId,
          cfi_position: cfiPosition,
          percentage,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: "user_id,book_id" }
      );
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["reading-progress", vars.bookId] });
    },
  });
}

// ── Bookmarks ──
export function useBookmarks(bookId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bookmarks", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reader_bookmarks")
        .select("*")
        .eq("user_id", user!.id)
        .eq("book_id", bookId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!bookId,
  });
}

export function useAddBookmark() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      bookId,
      cfiPosition,
      label,
    }: {
      bookId: string;
      cfiPosition: string;
      label: string;
    }) => {
      const { error } = await supabase.from("reader_bookmarks").insert({
        user_id: user!.id,
        book_id: bookId,
        cfi_position: cfiPosition,
        label,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      toast.success("Bookmark added");
      qc.invalidateQueries({ queryKey: ["bookmarks", vars.bookId] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, bookId }: { id: string; bookId: string }) => {
      const { error } = await supabase
        .from("reader_bookmarks")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return bookId;
    },
    onSuccess: (bookId) => {
      toast.success("Bookmark removed");
      qc.invalidateQueries({ queryKey: ["bookmarks", bookId] });
    },
    onError: (e) => toast.error(e.message),
  });
}

// ── Highlights ──
export function useHighlights(bookId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["highlights", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reader_highlights")
        .select("*")
        .eq("user_id", user!.id)
        .eq("book_id", bookId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!bookId,
  });
}

export function useAddHighlight() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      bookId,
      cfiRange,
      text,
      color,
      note,
    }: {
      bookId: string;
      cfiRange: string;
      text: string;
      color?: string;
      note?: string;
    }) => {
      const { error } = await supabase.from("reader_highlights").insert({
        user_id: user!.id,
        book_id: bookId,
        cfi_range: cfiRange,
        text,
        color: color || "yellow",
        note,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      toast.success("Highlight saved");
      qc.invalidateQueries({ queryKey: ["highlights", vars.bookId] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteHighlight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, bookId }: { id: string; bookId: string }) => {
      const { error } = await supabase
        .from("reader_highlights")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return bookId;
    },
    onSuccess: (bookId) => {
      qc.invalidateQueries({ queryKey: ["highlights", bookId] });
    },
    onError: (e) => toast.error(e.message),
  });
}

// ── Fetch EPUB binary via edge function ──
export function useEpubData(bookId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["epub-data", bookId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("serve-ebook", {
        body: { bookId },
      });
      if (error) throw error;
      // data is already an ArrayBuffer or Blob
      if (data instanceof ArrayBuffer) return data;
      if (data instanceof Blob) return await data.arrayBuffer();
      throw new Error("Unexpected response format");
    },
    enabled: !!user && !!bookId,
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });
}
