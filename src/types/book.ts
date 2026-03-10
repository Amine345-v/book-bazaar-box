export type I18nField = Record<string, string>;

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
  epubKey?: string;
  // i18n fields
  titleI18n?: I18nField;
  descriptionI18n?: I18nField;
  categoryI18n?: I18nField;
  formatI18n?: I18nField;
};
