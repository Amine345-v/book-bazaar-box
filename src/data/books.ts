// Re-export Book type from new location for backwards compatibility
export type { Book } from "@/types/book";

export const categories = [
  "All",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Self-Help",
  "Historical Fiction",
  "Contemporary",
  "Business",
  "Poetry",
  "Cooking",
] as const;
