import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { toast } from "sonner";
import type { Book, I18nField } from "@/types/book";

// Static cover image imports
import bookCover1 from "@/assets/book-cover-1.jpg";
import bookCover2 from "@/assets/book-cover-2.jpg";
import bookCover3 from "@/assets/book-cover-3.jpg";
import bookCover4 from "@/assets/book-cover-4.jpg";
import bookCover5 from "@/assets/book-cover-5.jpg";
import bookCover6 from "@/assets/book-cover-6.jpg";
import bookCover7 from "@/assets/book-cover-7.jpg";
import bookCover8 from "@/assets/book-cover-8.jpg";
import bookCover9 from "@/assets/book-cover-9.jpg";
import bookCover10 from "@/assets/book-cover-10.jpg";
import bookCover11 from "@/assets/book-cover-11.jpg";
import bookCover12 from "@/assets/book-cover-12.jpg";

const coverMap: Record<string, string> = {
  "book-cover-1": bookCover1,
  "book-cover-2": bookCover2,
  "book-cover-3": bookCover3,
  "book-cover-4": bookCover4,
  "book-cover-5": bookCover5,
  "book-cover-6": bookCover6,
  "book-cover-7": bookCover7,
  "book-cover-8": bookCover8,
  "book-cover-9": bookCover9,
  "book-cover-10": bookCover10,
  "book-cover-11": bookCover11,
  "book-cover-12": bookCover12,
};

async function fetchBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  type RawBookRow = {
    id: string;
    title: string;
    author: string;
    price: number;
    original_price: number | null;
    cover_key: string;
    category: string;
    rating: number;
    reviews_count: number;
    description: string;
    featured: boolean;
    bestseller: boolean;
    new_arrival: boolean;
    pages: number;
    language: string;
    format: string;
    publish_date: string;
    epub_key?: string | null;
    title_i18n?: I18nField;
    description_i18n?: I18nField;
    category_i18n?: I18nField;
    format_i18n?: I18nField;
  };

  return (data || []).map((row: RawBookRow) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    cover: coverMap[row.cover_key] || "/placeholder.svg",
    category: row.category,
    rating: Number(row.rating),
    reviews: row.reviews_count,
    description: row.description,
    featured: row.featured,
    bestseller: row.bestseller,
    newArrival: row.new_arrival,
    pages: row.pages,
    language: row.language,
    format: row.format,
    publishDate: row.publish_date,
    epubKey: row.epub_key || undefined,
    titleI18n: row.title_i18n,
    descriptionI18n: row.description_i18n,
    categoryI18n: row.category_i18n,
    formatI18n: row.format_i18n,
  }))
}

/** Resolve an i18n field for the current language, falling back to English then the raw value */
function localize(i18nField: I18nField | undefined, fallback: string, lang: string): string {
  if (!i18nField || Object.keys(i18nField).length === 0) return fallback;
  return i18nField[lang] || i18nField["en"] || fallback;
}

export function useBooks() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "en";

  const query = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
    staleTime: 5 * 60 * 1000,
  });

  const localizedBooks = useMemo(() => {
    if (!query.data) return undefined;
    return query.data.map((book) => ({
      ...book,
      title: localize(book.titleI18n, book.title, lang),
      description: localize(book.descriptionI18n, book.description, lang),
      category: localize(book.categoryI18n, book.category, lang),
      format: localize(book.formatI18n, book.format, lang),
    }));
  }, [query.data, lang]);

  return { ...query, data: localizedBooks };
}

export function useBook(id: string | undefined) {
  const { data: books, ...rest } = useBooks();
  const book = books?.find((b) => b.id === id);
  return { book, books, ...rest };
}

type BookInput = {
  id: string;
  title: string;
  author: string;
  price: number;
  original_price?: number | null;
  category: string;
  cover_key: string;
  description: string;
  pages: number;
  language: string;
  format: string;
  epub_key?: string | null;
  featured: boolean;
  bestseller: boolean;
  new_arrival: boolean;
};

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: BookInput) => {
      const { error } = await supabase.from("books").insert(input);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Book created");
      qc.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: BookInput) => {
      const { error } = await supabase.from("books").update(input).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Book updated");
      qc.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("books").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Book deleted");
      qc.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useTranslateBooks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("translate-books");
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Translation complete");
      qc.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (e) => toast.error(e.message || "Translation failed"),
  });
}
