import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { books, categories } from "@/data/books";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  Mystery: "from-blue-900/80 to-blue-700/60",
  Romance: "from-rose-900/80 to-rose-700/60",
  "Sci-Fi": "from-indigo-900/80 to-purple-700/60",
  Fantasy: "from-emerald-900/80 to-emerald-700/60",
  "Self-Help": "from-amber-900/80 to-amber-700/60",
  "Historical Fiction": "from-orange-900/80 to-orange-700/60",
  Contemporary: "from-pink-900/80 to-pink-700/60",
  Business: "from-slate-900/80 to-slate-700/60",
  Poetry: "from-red-900/80 to-red-700/60",
  Cooking: "from-green-900/80 to-green-700/60",
};

const Categories = () => {
  const navigate = useNavigate();

  const categoryData = categories
    .filter((c) => c !== "All")
    .map((cat) => {
      const catBooks = books.filter((b) => b.category === cat);
      return {
        name: cat,
        count: catBooks.length,
        cover: catBooks[0]?.cover,
      };
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Categories
          </h1>
          <p className="font-body text-muted-foreground">
            Browse by genre to find your perfect read
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoryData.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate("/browse")}
              className="group relative h-48 rounded-xl overflow-hidden shadow-book hover:shadow-book-hover transition-all duration-300 text-left"
            >
              {cat.cover && (
                <img
                  src={cat.cover}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[cat.name] || "from-gray-900/80 to-gray-700/60"}`} />
              <div className="relative h-full p-6 flex flex-col justify-end">
                <h3 className="font-display text-2xl font-bold text-primary-foreground mb-1">
                  {cat.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="font-body text-sm text-primary-foreground/70">
                    {cat.count} title{cat.count !== 1 ? "s" : ""}
                  </p>
                  <ArrowRight className="h-5 w-5 text-primary-foreground/70 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
