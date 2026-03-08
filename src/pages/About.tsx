import { BookOpen, Users, Globe, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";

const stats = [
  { icon: BookOpen, label: "Titles Available", value: "10,000+" },
  { icon: Users, label: "Happy Readers", value: "250K+" },
  { icon: Globe, label: "Countries", value: "120+" },
  { icon: Heart, label: "5-Star Reviews", value: "45K+" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 py-16 text-center max-w-3xl">
          <h1 className="font-display text-5xl font-bold text-foreground mb-4">
            About Book Bazaar
          </h1>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">
            We believe everyone deserves access to great stories. Book Bazaar was born from a love of reading and a desire to make ebooks more affordable, accessible, and beautiful. Our curated collection spans every genre, from pulse-pounding thrillers to soul-stirring poetry.
          </p>
        </section>

        {/* Stats */}
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

        {/* Story */}
        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6 text-center">
            Our Story
          </h2>
          <div className="font-body text-foreground/80 leading-relaxed space-y-4">
            <p>
              Founded in 2023, PageTurn started as a small passion project by a group of bookworms who wanted to create a better ebook experience. We were frustrated by cluttered interfaces, DRM restrictions, and the lack of curation in existing platforms.
            </p>
            <p>
              Today, we serve over 250,000 readers across 120 countries. Our team of editors handpicks every title in our Featured collection, ensuring you always find something worth reading. We work directly with publishers and independent authors to bring you the best prices possible.
            </p>
            <p>
              Every ebook on PageTurn is DRM-free, meaning you truly own what you buy. Read on any device, any app, any time. That's our promise.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Quality Curation", desc: "Every featured book is personally reviewed by our editorial team." },
                { title: "Fair Pricing", desc: "We keep margins thin so great literature stays accessible to everyone." },
                { title: "Reader Freedom", desc: "DRM-free files that you own forever. No strings attached." },
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
