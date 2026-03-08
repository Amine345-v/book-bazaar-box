import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation();

  const sectionKeys = ["acceptance", "registration", "payments", "license", "refund", "conduct", "liability", "changes"] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-display text-5xl font-bold text-foreground mb-2 text-center">{t("terms.title")}</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-12">{t("terms.lastUpdated")}</p>

        <div className="space-y-8">
          {sectionKeys.map((key) => (
            <section key={key}>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">{t(`terms.sections.${key}.title`)}</h2>
              <p className="font-body text-foreground/80 leading-relaxed">{t(`terms.sections.${key}.body`)}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
