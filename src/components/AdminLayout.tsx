import { useState } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/stores/auth-store";
import { useIsAdmin } from "@/hooks/use-admin";
import { LayoutDashboard, BookOpen, ShoppingBag, Users, ArrowLeft, Shield, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: BookOpen, label: "Books", path: "/admin/books" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Users", path: "/admin/users" },
];

const SidebarContent = ({ location, onNavigate }: { location: ReturnType<typeof useLocation>; onNavigate?: () => void }) => (
  <>
    <div className="p-4 border-b">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <span className="font-display text-lg font-bold text-foreground">Admin Panel</span>
      </div>
    </div>

    <nav className="flex-1 p-3 space-y-1">
      {adminNavItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>

    <div className="p-3 border-t space-y-1">
      <div className="flex items-center gap-2 px-3 py-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Store
      </Link>
    </div>
  </>
);

const AdminLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-card shrink-0 sticky top-0 h-screen flex-col">
        <SidebarContent location={location} />
      </aside>

      {/* Mobile header + sheet */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md flex items-center gap-3 px-4 py-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-card flex flex-col">
              <SidebarContent location={location} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-bold text-foreground">Admin</span>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
