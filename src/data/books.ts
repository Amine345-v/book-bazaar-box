import bookCover1 from "@/assets/book-cover-1.jpg";
import bookCover2 from "@/assets/book-cover-2.jpg";
import bookCover3 from "@/assets/book-cover-3.jpg";
import bookCover4 from "@/assets/book-cover-4.jpg";
import bookCover5 from "@/assets/book-cover-5.jpg";
import bookCover6 from "@/assets/book-cover-6.jpg";

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
};

export const categories = [
  "All",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Self-Help",
  "Historical Fiction",
] as const;

export const books: Book[] = [
  {
    id: "1",
    title: "The Last Cipher",
    author: "Lain R. Lien",
    price: 9.99,
    originalPrice: 14.99,
    cover: bookCover1,
    category: "Mystery",
    rating: 4.7,
    reviews: 1243,
    description: "A gripping mystery thriller that takes you through a labyrinth of ancient codes and modern-day espionage. When cryptographer Elena discovers a cipher hidden in a Renaissance painting, she's thrust into a dangerous game.",
    featured: true,
  },
  {
    id: "2",
    title: "Autumn Hearts",
    author: "K.L. Dolen",
    price: 7.99,
    cover: bookCover2,
    category: "Romance",
    rating: 4.5,
    reviews: 892,
    description: "A heartwarming romance set against the vibrant backdrop of a New England autumn. Two strangers find connection in the most unexpected of places.",
  },
  {
    id: "3",
    title: "Beyond the Stars",
    author: "Marcus Toun",
    price: 11.99,
    originalPrice: 16.99,
    cover: bookCover3,
    category: "Sci-Fi",
    rating: 4.8,
    reviews: 2105,
    description: "An epic space opera that spans galaxies and generations. When humanity's last hope rests on one astronaut's shoulders, the journey becomes more than survival — it becomes transcendence.",
    featured: true,
  },
  {
    id: "4",
    title: "The Enchanted Crown",
    author: "Sarien Woren",
    price: 8.99,
    cover: bookCover4,
    category: "Fantasy",
    rating: 4.6,
    reviews: 1567,
    description: "In a world where magic is fading, a young forester discovers an ancient crown that could restore the balance — or destroy everything she loves.",
  },
  {
    id: "5",
    title: "The Art of Focus",
    author: "Dr. Helena Cross",
    price: 12.99,
    cover: bookCover5,
    category: "Self-Help",
    rating: 4.4,
    reviews: 3421,
    description: "A transformative guide to reclaiming your attention in the age of distraction. Based on decades of research and mindfulness practice.",
  },
  {
    id: "6",
    title: "Echoes of Rome",
    author: "Betil Jreen",
    price: 10.99,
    originalPrice: 15.99,
    cover: bookCover6,
    category: "Historical Fiction",
    rating: 4.7,
    reviews: 987,
    description: "A sweeping historical epic that brings ancient Rome to life through the eyes of a gladiator-turned-senator navigating the treacherous politics of the Empire.",
  },
];
