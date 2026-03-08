import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const { t } = useTranslation();

  const handleCheckout = async () => {
    if (!user) {
      toast.error(t("cart.signInRequired"));
      navigate("/auth");
      return;
    }

    setCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: items.map((item) => ({
            title: item.book.title,
            price: item.book.price,
            quantity: item.quantity,
            bookId: item.book.id,
          })),
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">{t("cart.empty")}</h1>
          <p className="font-body text-muted-foreground mb-6">{t("cart.emptyDesc")}</p>
          <Button className="font-body font-semibold" onClick={() => navigate("/browse")}>{t("cart.startShopping")}</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="font-body gap-2 mb-6 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> {t("cart.continueShopping")}
        </Button>

        <h1 className="font-display text-4xl font-bold text-foreground mb-8">{t("cart.title")}</h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-4">
            {items.map(({ book, quantity }) => (
              <div key={book.id} className="flex gap-4 bg-card rounded-xl p-4 shadow-book">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg cursor-pointer shrink-0"
                  onClick={() => navigate(`/book/${book.id}`)}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-display text-lg font-semibold text-card-foreground cursor-pointer hover:text-primary transition-colors truncate"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    {book.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">{book.author}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{book.format}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateQuantity(book.id, quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-body font-medium text-sm w-6 text-center text-card-foreground">{quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateQuantity(book.id, quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-lg font-bold text-card-foreground">${(book.price * quantity).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(book.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="font-body text-sm text-muted-foreground" onClick={() => { clearCart(); toast.info(t("cart.cartCleared")); }}>
              {t("cart.clearCart")}
            </Button>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-book h-fit sticky top-24">
            <h2 className="font-display text-xl font-bold text-card-foreground mb-4">{t("cart.orderSummary")}</h2>
            <div className="space-y-3 mb-4">
              {items.map(({ book, quantity }) => (
                <div key={book.id} className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground truncate mr-2">{book.title} × {quantity}</span>
                  <span className="text-card-foreground shrink-0">${(book.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between mb-6">
              <span className="font-display text-lg font-bold text-card-foreground">{t("cart.total")}</span>
              <span className="font-display text-2xl font-bold text-card-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full font-body font-semibold gap-2" size="lg" onClick={handleCheckout} disabled={checkingOut}>
              <CreditCard className="h-4 w-4" />
              {checkingOut ? t("cart.processing") : t("cart.checkout")}
            </Button>
            <p className="font-body text-xs text-muted-foreground text-center mt-3">
              {t("cart.secureCheckout")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
