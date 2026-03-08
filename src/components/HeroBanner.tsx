import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroBanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="relative h-[480px] overflow-hidden">
      <img
        src={heroBanner}
        alt="Cozy reading nook with books and warm lighting"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/45 to-transparent" />
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground/90 font-body text-sm px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            {t("hero.badge")}
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-4">
            {t("hero.title")}
          </h1>
          <p className="text-primary-foreground/80 font-body text-lg mb-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="flex gap-3">
            <Button
              size="lg"
              className="font-body font-semibold gap-2"
              onClick={() => navigate("/browse")}
            >
              {t("hero.browseCollection")} <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-body font-semibold bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground backdrop-blur-sm"
              onClick={() => navigate("/categories")}
            >
              {t("hero.viewCategories")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
