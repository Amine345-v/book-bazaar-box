import { BookOpen, Truck, Shield, Headphones } from "lucide-react";
import { useTranslation } from "react-i18next";

const FeaturesBar = () => {
  const { t } = useTranslation();

  const features = [
    { icon: BookOpen, title: t("features.instantAccess"), description: t("features.instantAccessDesc") },
    { icon: Shield, title: t("features.drmFree"), description: t("features.drmFreeDesc") },
    { icon: Truck, title: t("features.freeDelivery"), description: t("features.freeDeliveryDesc") },
    { icon: Headphones, title: t("features.support"), description: t("features.supportDesc") },
  ];

  return (
    <section className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-body font-semibold text-sm text-foreground">{f.title}</p>
                <p className="font-body text-xs text-muted-foreground">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
