import { BookOpen, Truck, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Instant Access",
    description: "Download and start reading immediately after purchase",
  },
  {
    icon: Shield,
    title: "DRM-Free",
    description: "Read your books on any device, no restrictions",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "All ebooks delivered to your library at no extra cost",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our readers support team is always here to help",
  },
];

const FeaturesBar = () => {
  return (
    <section className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-body font-semibold text-sm text-foreground">
                  {f.title}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
