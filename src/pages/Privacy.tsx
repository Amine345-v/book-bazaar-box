import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { title: "Information We Collect", body: "We collect information you provide directly, such as your name, email address, and payment details when you create an account or make a purchase. We also collect usage data automatically, including pages viewed, search queries, and device information." },
  { title: "How We Use Your Information", body: "We use your information to process transactions, personalize your experience, send order confirmations and updates, improve our services, and communicate with you about promotions (only if you opt in)." },
  { title: "Data Sharing", body: "We do not sell your personal information. We share data only with payment processors (Stripe) to complete transactions and with service providers who help us operate the platform, all under strict confidentiality agreements." },
  { title: "Data Security", body: "We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information." },
  { title: "Your Rights", body: "You may access, update, or delete your personal data at any time through your profile settings. You can also request a full export of your data by contacting our support team." },
  { title: "Cookies", body: "We use essential cookies for authentication and preferences. We do not use third-party advertising cookies. You can manage cookie settings in your browser." },
  { title: "Changes to This Policy", body: "We may update this policy from time to time. We will notify you of significant changes via email or a notice on our website." },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-display text-5xl font-bold text-foreground mb-2 text-center">Privacy Policy</h1>
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

export default Privacy;
