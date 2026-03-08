import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
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
              Your destination for curated ebooks. Discover your next favorite read from our extensive collection.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: "Browse All", to: "/browse" },
                { label: "New Arrivals", to: "/browse?filter=new" },
                { label: "Bestsellers", to: "/browse?filter=bestseller" },
                { label: "On Sale", to: "/browse?filter=sale" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Categories</h4>
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
            <h4 className="font-display font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
              ].map((item) => (
                <li key={item.label}>
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
            © 2026 Book Bazaar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
