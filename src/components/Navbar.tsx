import { ShoppingCart, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  cartCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Navbar = ({ cartCount, searchQuery, onSearchChange }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl font-bold text-foreground">
            PageTurn
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books, authors..."
              className="pl-10 bg-secondary/50 border-border font-body"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
