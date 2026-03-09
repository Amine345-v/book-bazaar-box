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

  return (data || []).map((row) => ({
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
    titleI18n: (row as any).title_i18n as I18nField | undefined,
    descriptionI18n: (row as any).description_i18n as I18nField | undefined,
    categoryI18n: (row as any).category_i18n as I18nField | undefined,
    formatI18n: (row as any).format_i18n as I18nField | undefined,
  }));
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
