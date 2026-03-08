import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-20 text-center max-w-lg">
        <CheckCircle className="h-20 w-20 text-primary mx-auto mb-6" />
        <h1 className="font-display text-4xl font-bold text-foreground mb-3">
          Payment Successful!
        </h1>
        <p className="font-body text-lg text-muted-foreground mb-8">
          Thank you for your purchase. Your ebooks are now available in your library. Happy reading!
        </p>
        <div className="flex gap-3 justify-center">
          <Button className="font-body font-semibold" onClick={() => navigate("/purchases")}>
            View Purchases
          </Button>
          <Button variant="outline" className="font-body font-semibold" onClick={() => navigate("/browse")}>
            Continue Browsing
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
