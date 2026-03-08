import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { title: "Acceptance of Terms", body: "By accessing or using Book Bazaar, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services." },
  { title: "Account Registration", body: "You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and for all activity under your account." },
  { title: "Purchases and Payments", body: "All prices are listed in USD. Payments are processed securely through Stripe. Once a purchase is completed, you receive a perpetual, non-transferable license to access the purchased ebook." },
  { title: "Digital Content License", body: "Ebooks purchased on Book Bazaar are licensed, not sold. You may download and read purchased content on any personal device. You may not redistribute, resell, or share purchased content." },
  { title: "Refund Policy", body: "Due to the digital nature of our products, all sales are final. If you experience a technical issue preventing access to your purchase, please contact support for assistance." },
  { title: "User Conduct", body: "You agree not to misuse our services, attempt to gain unauthorized access to our systems, or engage in any activity that disrupts the platform's operation." },
  { title: "Limitation of Liability", body: "Book Bazaar is provided 'as is' without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service." },
  { title: "Changes to Terms", body: "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the revised terms." },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-display text-5xl font-bold text-foreground mb-2 text-center">Terms of Service</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-12">Last updated: March 1, 2026</p>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">{s.title}</h2>
              <p className="font-body text-foreground/80 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
