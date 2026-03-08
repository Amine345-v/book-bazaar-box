import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();

  const sectionKeys = ["collect", "use", "sharing", "security", "rights", "cookies", "changes"] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-display text-5xl font-bold text-foreground mb-2 text-center">{t("privacy.title")}</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-12">{t("privacy.lastUpdated")}</p>

        <div className="space-y-8">
          {sectionKeys.map((key) => (
            <section key={key}>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">{t(`privacy.sections.${key}.title`)}</h2>
              <p className="font-body text-foreground/80 leading-relaxed">{t(`privacy.sections.${key}.body`)}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
