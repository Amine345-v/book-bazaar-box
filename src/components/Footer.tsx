import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">
                PageTurn
              </span>
            </Link>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Your destination for curated ebooks. Discover your next favorite read from our extensive collection.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Shop</h4>
            <ul className="space-y-2">
              {["Browse All", "New Arrivals", "Bestsellers", "On Sale"].map((item) => (
                <li key={item}>
                  <Link to="/browse" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
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
                  <Link to="/categories" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Contact", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <Link to="/about" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 text-center">
          <p className="font-body text-sm text-muted-foreground">
            © 2026 PageTurn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
