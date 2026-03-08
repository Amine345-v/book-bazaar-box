import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="relative h-[420px] overflow-hidden">
      <img
        src={heroBanner}
        alt="Cozy reading nook with books and warm lighting"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-lg">
          <p className="text-primary-foreground/80 font-body text-sm uppercase tracking-widest mb-3">
            Your Next Story Awaits
          </p>
          <h1 className="font-display text-5xl font-bold text-primary-foreground leading-tight mb-4">
            Discover Worlds Between the Pages
          </h1>
          <p className="text-primary-foreground/80 font-body text-lg mb-6">
            Explore thousands of ebooks — from bestselling thrillers to timeless classics. New arrivals every week.
          </p>
          <Button size="lg" className="font-body font-semibold gap-2">
            Browse Collection <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
