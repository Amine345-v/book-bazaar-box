import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import FeaturesBar from "@/components/FeaturesBar";
import BookSection from "@/components/BookSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { books } from "@/data/books";

const Index = () => {
  const featured = useMemo(() => books.filter((b) => b.featured), []);
  const bestsellers = useMemo(() => books.filter((b) => b.bestseller), []);
  const newArrivals = useMemo(() => books.filter((b) => b.newArrival), []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <FeaturesBar />

      <main className="container mx-auto px-4">
        <BookSection title="Featured Picks" subtitle="Handpicked by our editors" books={featured} showViewAll />
        <BookSection title="Bestsellers" subtitle="Most loved by our readers" books={bestsellers} showViewAll />
        <BookSection title="New Arrivals" subtitle="Fresh off the press" books={newArrivals} showViewAll />
      </main>

      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
