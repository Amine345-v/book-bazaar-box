import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t("newsletter.success"), {
        description: t("newsletter.successDesc"),
      });
      setEmail("");
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center bg-card rounded-2xl p-10 shadow-book border border-border">
          <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            {t("newsletter.title")}
          </h2>
          <p className="font-body text-muted-foreground mb-6">
            {t("newsletter.subtitle")}
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-body bg-secondary/50"
              required
            />
            <Button type="submit" className="font-body font-semibold shrink-0">
              {t("newsletter.subscribe")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
