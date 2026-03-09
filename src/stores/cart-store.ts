import { create } from "zustand";
import { toast } from "sonner";
import type { Book } from "@/types/book";

export type CartItem = {
  book: Book;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addToCart: (book) => {
    const items = get().items;
    const existing = items.find((item) => item.book.id === book.id);
    let newItems: CartItem[];

    if (existing) {
      toast.success(`Added another copy of "${book.title}"`);
      newItems = items.map((item) =>
        item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      toast.success(`"${book.title}" added to cart`, { description: `$${book.price}` });
      newItems = [...items, { book, quantity: 1 }];
    }

    set({
      items: newItems,
      totalItems: newItems.reduce((s, i) => s + i.quantity, 0),
      totalPrice: newItems.reduce((s, i) => s + i.book.price * i.quantity, 0),
    });
  },

  removeFromCart: (bookId) => {
    const newItems = get().items.filter((item) => item.book.id !== bookId);
    set({
      items: newItems,
      totalItems: newItems.reduce((s, i) => s + i.quantity, 0),
      totalPrice: newItems.reduce((s, i) => s + i.book.price * i.quantity, 0),
    });
  },

  updateQuantity: (bookId, quantity) => {
    let newItems: CartItem[];
    if (quantity <= 0) {
      newItems = get().items.filter((item) => item.book.id !== bookId);
    } else {
      newItems = get().items.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      );
    }
    set({
      items: newItems,
      totalItems: newItems.reduce((s, i) => s + i.quantity, 0),
      totalPrice: newItems.reduce((s, i) => s + i.book.price * i.quantity, 0),
    });
  },

  clearCart: () => {
    set({ items: [], totalItems: 0, totalPrice: 0 });
  },
}));

// Drop-in replacement hook
export const useCart = () => useCartStore();
