import { ShoppingCart, Menu, User, LogOut, Heart, UserCircle, Shield, BookOpen } from "lucide-react";
import logo from "@/assets/logo.png";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useIsAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/stores/cart-store";
import { useAuth } from "@/stores/auth-store";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Navbar = ({ searchQuery = "", onSearchChange }: NavbarProps) => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: isAdmin } = useIsAdmin();

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.browse"), href: "/browse" },
    { label: t("nav.categories"), href: "/categories" },
    { label: t("nav.about"), href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Book Bazaar" className="h-12 w-12 object-contain" />
          <span className="font-display text-2xl font-bold text-foreground">
            Book Bazaar
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <SearchAutocomplete />
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm">
                    {(user.user_metadata?.display_name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card">
                <div className="px-2 py-1.5">
                  <p className="font-body text-sm font-medium text-card-foreground truncate">
                    {user.user_metadata?.display_name || user.email}
                  </p>
                  <p className="font-body text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")} className="font-body cursor-pointer text-primary">
                    <Shield className="h-4 w-4 mr-2" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate("/profile")} className="font-body cursor-pointer">
                  <UserCircle className="h-4 w-4 mr-2" /> {t("nav.myProfile")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/wishlist")} className="font-body cursor-pointer">
                  <Heart className="h-4 w-4 mr-2" /> {t("nav.myWishlist")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/purchases")} className="font-body cursor-pointer">
                  <ShoppingCart className="h-4 w-4 mr-2" /> {t("nav.myPurchases")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="font-body cursor-pointer text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" /> {t("nav.signOut")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              className="font-body font-medium"
              onClick={() => navigate("/auth")}
            >
              <User className="h-4 w-4 mr-2" /> {t("nav.signIn")}
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="font-body text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
