import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import FeaturesBar from "@/components/FeaturesBar";
import BookSection from "@/components/BookSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { useBooks } from "@/hooks/use-books";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { data: books = [], isLoading } = useBooks();
  const { t } = useTranslation();

  const featured = useMemo(() => books.filter((b) => b.featured), [books]);
  const bestsellers = useMemo(() => books.filter((b) => b.bestseller), [books]);
  const newArrivals = useMemo(() => books.filter((b) => b.newArrival), [books]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <FeaturesBar />

      <main className="container mx-auto px-4">
        {isLoading ? (
          <div className="py-20 text-center">
            <p className="font-body text-muted-foreground">{t("sections.loadingBooks")}</p>
          </div>
        ) : (
          <>
            <BookSection title={t("sections.featuredPicks")} subtitle={t("sections.featuredPicksSub")} books={featured} showViewAll />
            <BookSection title={t("sections.bestsellers")} subtitle={t("sections.bestsellersSub")} books={bestsellers} showViewAll />
            <BookSection title={t("sections.newArrivals")} subtitle={t("sections.newArrivalsSub")} books={newArrivals} showViewAll />
          </>
        )}
      </main>

      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
