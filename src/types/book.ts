export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  cover: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  pages: number;
  language: string;
  format: string;
  publishDate: string;
};
