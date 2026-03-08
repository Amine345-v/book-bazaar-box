import { useState } from "react";
import { useBooks } from "@/hooks/use-books";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Languages } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type BookFormData = {
  id: string;
  title: string;
  author: string;
  price: string;
  original_price: string;
  category: string;
  cover_key: string;
  description: string;
  pages: string;
  language: string;
  format: string;
  featured: boolean;
  bestseller: boolean;
  new_arrival: boolean;
};

const emptyForm: BookFormData = {
  id: "",
  title: "",
  author: "",
  price: "",
  original_price: "",
  category: "",
  cover_key: "book-cover-1",
  description: "",
  pages: "0",
  language: "English",
  format: "EPUB, PDF",
  featured: false,
  bestseller: false,
  new_arrival: false,
};

const AdminBooks = () => {
  const { data: books = [], isLoading } = useBooks();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BookFormData>(emptyForm);
  const queryClient = useQueryClient();

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, id: `book-${Date.now()}` });
    setDialogOpen(true);
  };

  const openEdit = (book: typeof books[0]) => {
    setEditingId(book.id);
    setForm({
      id: book.id,
      title: book.title,
      author: book.author,
      price: String(book.price),
      original_price: book.originalPrice ? String(book.originalPrice) : "",
      category: book.category,
      cover_key: book.id.includes("book-cover") ? book.id : "book-cover-1",
      description: book.description,
      pages: String(book.pages),
      language: book.language,
      format: book.format,
      featured: !!book.featured,
      bestseller: !!book.bestseller,
      new_arrival: !!book.newArrival,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.author || !form.price || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const row = {
      id: form.id,
      title: form.title,
      author: form.author,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      category: form.category,
      cover_key: form.cover_key,
      description: form.description,
      pages: Number(form.pages),
      language: form.language,
      format: form.format,
      featured: form.featured,
      bestseller: form.bestseller,
      new_arrival: form.new_arrival,
    };

    let error;
    if (editingId) {
      const { error: e } = await supabase.from("books").update(row).eq("id", editingId);
      error = e;
    } else {
      const { error: e } = await supabase.from("books").insert(row);
      error = e;
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(editingId ? "Book updated" : "Book created");
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Book deleted");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    }
  };

  const updateForm = (field: keyof BookFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Books</h1>
        <Button className="font-body gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Book
        </Button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 font-body"
        />
      </div>

      {isLoading ? (
        <p className="font-body text-muted-foreground">Loading...</p>
      ) : (
        <div className="bg-card rounded-xl shadow-book border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Title</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Author</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Category</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Price</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Rating</th>
                  <th className="text-left font-body text-xs text-muted-foreground uppercase p-4">Flags</th>
                  <th className="text-right font-body text-xs text-muted-foreground uppercase p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="border-b last:border-0 hover:bg-secondary/10">
                    <td className="p-4 font-body text-sm font-medium text-foreground">{book.title}</td>
                    <td className="p-4 font-body text-sm text-muted-foreground">{book.author}</td>
                    <td className="p-4 font-body text-sm text-muted-foreground">{book.category}</td>
                    <td className="p-4 font-body text-sm font-medium text-foreground">${book.price}</td>
                    <td className="p-4 font-body text-sm text-muted-foreground">⭐ {book.rating}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {book.featured && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-body">Featured</span>}
                        {book.bestseller && <span className="text-xs bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-body">Bestseller</span>}
                        {book.newArrival && <span className="text-xs bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded font-body">New</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(book)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(book.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? "Edit Book" : "Add Book"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-body text-sm">Title *</Label>
              <Input value={form.title} onChange={(e) => updateForm("title", e.target.value)} className="font-body mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Author *</Label>
              <Input value={form.author} onChange={(e) => updateForm("author", e.target.value)} className="font-body mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Price *</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => updateForm("price", e.target.value)} className="font-body mt-1" />
              </div>
              <div>
                <Label className="font-body text-sm">Original Price</Label>
                <Input type="number" step="0.01" value={form.original_price} onChange={(e) => updateForm("original_price", e.target.value)} className="font-body mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Category *</Label>
                <Input value={form.category} onChange={(e) => updateForm("category", e.target.value)} className="font-body mt-1" />
              </div>
              <div>
                <Label className="font-body text-sm">Cover Key</Label>
                <Input value={form.cover_key} onChange={(e) => updateForm("cover_key", e.target.value)} className="font-body mt-1" />
              </div>
            </div>
            <div>
              <Label className="font-body text-sm">Description</Label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 font-body text-sm mt-1 resize-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="font-body text-sm">Pages</Label>
                <Input type="number" value={form.pages} onChange={(e) => updateForm("pages", e.target.value)} className="font-body mt-1" />
              </div>
              <div>
                <Label className="font-body text-sm">Language</Label>
                <Input value={form.language} onChange={(e) => updateForm("language", e.target.value)} className="font-body mt-1" />
              </div>
              <div>
                <Label className="font-body text-sm">Format</Label>
                <Input value={form.format} onChange={(e) => updateForm("format", e.target.value)} className="font-body mt-1" />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.featured} onCheckedChange={(v) => updateForm("featured", v)} />
                <Label className="font-body text-sm">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.bestseller} onCheckedChange={(v) => updateForm("bestseller", v)} />
                <Label className="font-body text-sm">Bestseller</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.new_arrival} onCheckedChange={(v) => updateForm("new_arrival", v)} />
                <Label className="font-body text-sm">New Arrival</Label>
              </div>
            </div>
            <Button className="w-full font-body font-semibold" onClick={handleSave}>
              {editingId ? "Save Changes" : "Create Book"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBooks;
