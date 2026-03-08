
-- Create books table
CREATE TABLE public.books (
  id text PRIMARY KEY,
  title text NOT NULL,
  author text NOT NULL,
  price numeric NOT NULL,
  original_price numeric,
  cover_key text NOT NULL,
  category text NOT NULL,
  rating numeric NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  bestseller boolean NOT NULL DEFAULT false,
  new_arrival boolean NOT NULL DEFAULT false,
  pages integer NOT NULL DEFAULT 0,
  language text NOT NULL DEFAULT 'English',
  format text NOT NULL DEFAULT 'EPUB, PDF',
  publish_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS - books are a public catalog
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Everyone can read books
CREATE POLICY "Books are viewable by everyone" ON public.books
  FOR SELECT USING (true);

-- Seed books data
INSERT INTO public.books (id, title, author, price, original_price, cover_key, category, rating, reviews_count, description, featured, bestseller, new_arrival, pages, language, format, publish_date) VALUES
('1', 'The Last Cipher', 'Lain R. Lien', 9.99, 14.99, 'book-cover-1', 'Mystery', 4.7, 1243, 'A gripping mystery thriller that takes you through a labyrinth of ancient codes and modern-day espionage. When cryptographer Elena discovers a cipher hidden in a Renaissance painting, she''s thrust into a dangerous game that spans continents and centuries. With each clue she unravels, the stakes grow higher, and she realizes the cipher holds the key to a secret that powerful forces will kill to protect.', true, true, false, 384, 'English', 'EPUB, PDF, MOBI', '2025-11-15'),
('2', 'Autumn Hearts', 'K.L. Dolen', 7.99, NULL, 'book-cover-2', 'Romance', 4.5, 892, 'A heartwarming romance set against the vibrant backdrop of a New England autumn. Two strangers find connection in the most unexpected of places — a quaint bookshop on the verge of closing. As the leaves change color, so do their lives, intertwining in ways neither could have predicted.', false, true, false, 312, 'English', 'EPUB, PDF', '2025-09-22'),
('3', 'Beyond the Stars', 'Marcus Toun', 11.99, 16.99, 'book-cover-3', 'Sci-Fi', 4.8, 2105, 'An epic space opera that spans galaxies and generations. When humanity''s last hope rests on one astronaut''s shoulders, the journey becomes more than survival — it becomes transcendence. A breathtaking exploration of what it means to be human in the vastness of space.', true, true, false, 456, 'English', 'EPUB, PDF, MOBI', '2025-08-10'),
('4', 'The Enchanted Crown', 'Sarien Woren', 8.99, NULL, 'book-cover-4', 'Fantasy', 4.6, 1567, 'In a world where magic is fading, a young forester discovers an ancient crown that could restore the balance — or destroy everything she loves. An enchanting tale of courage, sacrifice, and the true meaning of power.', false, true, false, 528, 'English', 'EPUB, PDF', '2025-07-05'),
('5', 'The Art of Focus', 'Dr. Helena Cross', 12.99, NULL, 'book-cover-5', 'Self-Help', 4.4, 3421, 'A transformative guide to reclaiming your attention in the age of distraction. Based on decades of research and mindfulness practice, this book offers practical strategies for deepening concentration, building lasting habits, and finding clarity in chaos.', false, false, false, 248, 'English', 'EPUB, PDF, MOBI', '2025-06-18'),
('6', 'Echoes of Rome', 'Betil Jreen', 10.99, 15.99, 'book-cover-6', 'Historical Fiction', 4.7, 987, 'A sweeping historical epic that brings ancient Rome to life through the eyes of a gladiator-turned-senator navigating the treacherous politics of the Empire. Rich in detail and drama, it''s a story of ambition, betrayal, and redemption.', true, false, false, 492, 'English', 'EPUB, PDF', '2025-10-01'),
('7', 'Whispers in the Dark', 'Asherl Llver', 8.49, 12.99, 'book-cover-7', 'Mystery', 4.3, 654, 'A chilling psychological thriller set in an abandoned asylum. When investigative journalist Maya accepts a dare to spend a week inside, she discovers that some whispers aren''t just echoes of the past — they''re warnings about the future.', false, false, true, 336, 'English', 'EPUB, PDF', '2026-02-14'),
('8', 'The Morning After', 'Calleng', 6.99, NULL, 'book-cover-8', 'Contemporary', 4.2, 423, 'A poignant contemporary novel about second chances in the city that never sleeps. After a life-altering event, three strangers'' paths collide on a single morning, changing the course of their lives forever.', false, false, true, 288, 'English', 'EPUB, PDF', '2026-01-20'),
('9', 'Digital Mindset', 'Prof. Alan Reeves', 14.99, 19.99, 'book-cover-9', 'Business', 4.5, 1876, 'The definitive guide to thriving in the digital age. From AI and blockchain to remote leadership, this book equips professionals with the mental frameworks needed to navigate technological disruption and emerge stronger.', false, true, true, 320, 'English', 'EPUB, PDF, MOBI', '2026-03-01'),
('10', 'Midnight Verses', 'Aria Fontaine', 5.99, NULL, 'book-cover-10', 'Poetry', 4.8, 312, 'A hauntingly beautiful collection of poems that explores love, loss, and the spaces in between. Written in the quiet hours of the night, each verse captures raw emotion with delicate precision.', false, false, true, 144, 'English', 'EPUB, PDF', '2026-02-28'),
('11', 'Seasons on a Plate', 'Raysaan B. Ritson', 16.99, 22.99, 'book-cover-11', 'Cooking', 4.6, 745, 'A gorgeous cookbook celebrating seasonal cooking with over 120 recipes that honor the rhythm of nature. From spring''s first asparagus to winter''s hearty stews, each chapter is a love letter to fresh, honest food.', true, false, false, 368, 'English', 'EPUB, PDF', '2025-12-10'),
('12', 'The Shadow Gate', 'Eplng Nemts', 9.49, NULL, 'book-cover-12', 'Fantasy', 4.4, 1023, 'When fifteen-year-old Kira stumbles through a hidden portal in her grandmother''s garden, she enters a world where shadows have substance and magic demands sacrifice. To find her way home, she must master powers she never knew she had.', false, false, true, 416, 'English', 'EPUB, PDF, MOBI', '2026-03-05');

-- Add updated_at trigger
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
