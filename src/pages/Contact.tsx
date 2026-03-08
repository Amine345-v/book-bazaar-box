import { Mail, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-display text-5xl font-bold text-foreground mb-4 text-center">
          Contact Us
        </h1>
        <p className="font-body text-lg text-muted-foreground text-center mb-12">
          Have a question or feedback? We'd love to hear from you.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, title: "Email", detail: "support@bookbazaar.com" },
            { icon: MapPin, title: "Location", detail: "San Francisco, CA" },
            { icon: Clock, title: "Hours", detail: "Mon–Fri, 9 AM – 6 PM PT" },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-xl p-6 shadow-book text-center">
              <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-card-foreground mb-1">{item.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl p-8 shadow-book">
          <h2 className="font-display text-2xl font-bold text-card-foreground mb-2">Send us a message</h2>
          <p className="font-body text-sm text-muted-foreground mb-6">We typically respond within 24 hours.</p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Your name" className="w-full rounded-lg border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="email" placeholder="Your email" className="w-full rounded-lg border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <textarea rows={5} placeholder="Your message" className="w-full rounded-lg border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            <button type="submit" className="bg-primary text-primary-foreground font-body font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Send Message
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
