import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    text: "Book Bazaar completely changed how I read. The collection is incredible, and the prices are unbeatable. I've discovered so many hidden gems!",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "David K.",
    text: "Best ebook store I've used. Clean interface, instant downloads, and the recommendation engine actually understands my taste.",
    rating: 5,
    avatar: "DK",
  },
  {
    name: "Amira L.",
    text: "I love the curated collections and weekly deals. My reading list has never been more exciting. The quality of the formatting is top-notch.",
    rating: 4,
    avatar: "AL",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-foreground">
            What Readers Say
          </h2>
          <p className="font-body text-muted-foreground mt-2">
            Join thousands of happy readers worldwide
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-6 shadow-book relative"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-body font-semibold text-card-foreground text-sm">{t.name}</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3 w-3 ${
                          j < t.rating
                            ? "fill-primary text-primary"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {t.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
