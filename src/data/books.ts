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
    description: "A gripping mystery thriller that takes you through a labyrinth of ancient codes and modern-day espionage. When cryptographer Elena discovers a cipher hidden in a Renaissance painting, she's thrust into a dangerous game that spans continents and centuries. With each clue she unravels, the stakes grow higher, and she realizes the cipher holds the key to a secret that powerful forces will kill to protect.",
    featured: true,
    bestseller: true,
    pages: 384,
    language: "English",
    format: "EPUB, PDF, MOBI",
    publishDate: "2025-11-15",
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
    description: "A heartwarming romance set against the vibrant backdrop of a New England autumn. Two strangers find connection in the most unexpected of places — a quaint bookshop on the verge of closing. As the leaves change color, so do their lives, intertwining in ways neither could have predicted.",
    bestseller: true,
    pages: 312,
    language: "English",
    format: "EPUB, PDF",
    publishDate: "2025-09-22",
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
    description: "An epic space opera that spans galaxies and generations. When humanity's last hope rests on one astronaut's shoulders, the journey becomes more than survival — it becomes transcendence. A breathtaking exploration of what it means to be human in the vastness of space.",
    featured: true,
    bestseller: true,
    pages: 456,
    language: "English",
    format: "EPUB, PDF, MOBI",
    publishDate: "2025-08-10",
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
    description: "In a world where magic is fading, a young forester discovers an ancient crown that could restore the balance — or destroy everything she loves. An enchanting tale of courage, sacrifice, and the true meaning of power.",
    bestseller: true,
    pages: 528,
    language: "English",
    format: "EPUB, PDF",
    publishDate: "2025-07-05",
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
    description: "A transformative guide to reclaiming your attention in the age of distraction. Based on decades of research and mindfulness practice, this book offers practical strategies for deepening concentration, building lasting habits, and finding clarity in chaos.",
    pages: 248,
    language: "English",
    format: "EPUB, PDF, MOBI",
    publishDate: "2025-06-18",
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
    description: "A sweeping historical epic that brings ancient Rome to life through the eyes of a gladiator-turned-senator navigating the treacherous politics of the Empire. Rich in detail and drama, it's a story of ambition, betrayal, and redemption.",
    featured: true,
    pages: 492,
    language: "English",
    format: "EPUB, PDF",
    publishDate: "2025-10-01",
  },
  {
    id: "7",
    title: "Whispers in the Dark",
    author: "Asherl Llver",
    price: 8.49,
    originalPrice: 12.99,
    cover: bookCover7,
    category: "Mystery",
    rating: 4.3,
    reviews: 654,
    description: "A chilling psychological thriller set in an abandoned asylum. When investigative journalist Maya accepts a dare to spend a week inside, she discovers that some whispers aren't just echoes of the past — they're warnings about the future.",
    newArrival: true,
    pages: 336,
    language: "English",
    format: "EPUB, PDF",
    publishDate: "2026-02-14",
  },
  {
    id: "8",
    title: "The Morning After",
    author: "Calleng",
    price: 6.99,
    cover: bookCover8,
    category: "Contemporary",
    rating: 4.2,
    reviews: 423,
    description: "A poignant contemporary novel about second chances in the city that never sleeps. After a life-altering event, three strangers' paths collide on a single morning, changing the course of their lives forever.",
    newArrival: true,
    pages: 288,
    language: "English",
    format: "EPUB, PDF",
    publishDate: "2026-01-20",
  },
  {
    id: "9",
    title: "Digital Mindset",
    author: "Prof. Alan Reeves",
    price: 14.99,
    originalPrice: 19.99,
    cover: bookCover9,
    category: "Business",
    rating: 4.5,
    reviews: 1876,
    description: "The definitive guide to thriving in the digital age. From AI and blockchain to remote leadership, this book equips professionals with the mental frameworks needed to navigate technological disruption and emerge stronger.",
    newArrival: true,
    bestseller: true,
    pages: 320,
    language: "English",
    format: "EPUB, PDF, MOBI",
    publishDate: "2026-03-01",
  },
  {
    id: "10",
    title: "Midnight Verses",
    author: "Aria Fontaine",
    price: 5.99,
    cover: bookCover10,
    category: "Poetry",
    rating: 4.8,
    reviews: 312,
    description: "A hauntingly beautiful collection of poems that explores love, loss, and the spaces in between. Written in the quiet hours of the night, each verse captures raw emotion with delicate precision.",
    newArrival: true,
    pages: 144,
    language: "English",
    format: "EPUB, PDF",
    publishDate: "2026-02-28",
  },
  {
    id: "11",
    title: "Seasons on a Plate",
    author: "Raysaan B. Ritson",
    price: 16.99,
    originalPrice: 22.99,
    cover: bookCover11,
    category: "Cooking",
    rating: 4.6,
    reviews: 745,
    description: "A gorgeous cookbook celebrating seasonal cooking with over 120 recipes that honor the rhythm of nature. From spring's first asparagus to winter's hearty stews, each chapter is a love letter to fresh, honest food.",
    featured: true,
    pages: 368,
    language: "English",
    format: "EPUB, PDF",
    publishDate: "2025-12-10",
  },
  {
    id: "12",
    title: "The Shadow Gate",
    author: "Eplng Nemts",
    price: 9.49,
    cover: bookCover12,
    category: "Fantasy",
    rating: 4.4,
    reviews: 1023,
    description: "When fifteen-year-old Kira stumbles through a hidden portal in her grandmother's garden, she enters a world where shadows have substance and magic demands sacrifice. To find her way home, she must master powers she never knew she had.",
    newArrival: true,
    pages: 416,
    language: "English",
    format: "EPUB, PDF, MOBI",
    publishDate: "2026-03-05",
  },
];
