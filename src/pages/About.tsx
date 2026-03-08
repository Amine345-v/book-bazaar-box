import { BookOpen, Users, Globe, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: BookOpen, label: t("about.titlesAvailable"), value: "10,000+" },
    { icon: Users, label: t("about.happyReaders"), value: "250K+" },
    { icon: Globe, label: t("about.countries"), value: "120+" },
    { icon: Heart, label: t("about.fiveStarReviews"), value: "45K+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="container mx-auto px-4 py-16 text-center max-w-3xl">
          <h1 className="font-display text-5xl font-bold text-foreground mb-4">{t("about.title")}</h1>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">{t("about.intro")}</p>
        </section>

        <section className="bg-secondary/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6 text-center">{t("about.ourStory")}</h2>
          <div className="font-body text-foreground/80 leading-relaxed space-y-4">
            <p>{t("about.story1")}</p>
            <p>{t("about.story2")}</p>
            <p>{t("about.story3")}</p>
          </div>
        </section>

        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">{t("about.whatWeStandFor")}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: t("about.qualityCuration"), desc: t("about.qualityCurationDesc") },
                { title: t("about.fairPricing"), desc: t("about.fairPricingDesc") },
                { title: t("about.readerFreedom"), desc: t("about.readerFreedomDesc") },
              ].map((v) => (
                <div key={v.title} className="bg-card rounded-xl p-6 shadow-book">
                  <h3 className="font-display text-lg font-bold text-card-foreground mb-2">{v.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
