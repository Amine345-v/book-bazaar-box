import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src={logo} alt="Book Bazaar" className="h-7 w-7 object-contain" />
              <span className="font-display text-xl font-bold text-foreground">
                Book Bazaar
              </span>
            </Link>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">{t("footer.shop")}</h4>
            <ul className="space-y-2">
              {[
                { label: t("footer.browseAll"), to: "/browse" },
                { label: t("footer.newArrivals"), to: "/browse?filter=new" },
                { label: t("footer.bestsellers"), to: "/browse?filter=bestseller" },
                { label: t("footer.onSale"), to: "/browse?filter=sale" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">{t("footer.categories")}</h4>
            <ul className="space-y-2">
              {["Mystery", "Romance", "Sci-Fi", "Fantasy", "Self-Help"].map((item) => (
                <li key={item}>
                  <Link to={`/categories?category=${encodeURIComponent(item)}`} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">{t("footer.company")}</h4>
            <ul className="space-y-2">
              {[
                { label: t("footer.aboutUs"), to: "/about" },
                { label: t("footer.contact"), to: "/contact" },
                { label: t("footer.privacyPolicy"), to: "/privacy" },
                { label: t("footer.termsOfService"), to: "/terms" },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
