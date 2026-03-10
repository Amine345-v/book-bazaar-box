import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/stores/auth-store";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: readingProgress = [] } = useQuery<
    Array<{ book_id: string; percentage: number; last_read_at: string }>
  >({
    queryKey: ["reading-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("reading_progress")
        .select("book_id, percentage, last_read_at")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data || []) as Array<{ book_id: string; percentage: number; last_read_at: string }>;
    },
    enabled: !!user,
  });

  const { data: readingSessions = [] } = useQuery<
    Array<{ duration_seconds: number; started_at: string }>
  >({
    queryKey: ["reading-sessions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("reading_sessions")
        .select("duration_seconds, started_at")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Array<{ duration_seconds: number; started_at: string }>;
    },
    enabled: !!user,
  });

  const fetchProfileCallback = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", user!.id)
      .single();
    if (data) {
      setDisplayName(data.display_name || "");
      setAvatarUrl(data.avatar_url);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      fetchProfileCallback();
    }
  }, [user, authLoading, navigate, fetchProfileCallback]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", user!.id)
      .single();
    if (data) {
      setDisplayName(data.display_name || "");
      setAvatarUrl(data.avatar_url);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const url = `${publicUrl.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("user_id", user.id);

    if (updateError) {
      toast.error("Failed to update profile");
    } else {
      setAvatarUrl(url);
      toast.success("Avatar updated!");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user || !displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      await supabase.auth.updateUser({ data: { display_name: displayName.trim() } });
      toast.success("Profile updated!");
    }
    setSaving(false);
  };

  if (authLoading) return null;

  const initials = (displayName || user?.email || "U").charAt(0).toUpperCase();

  const totalReadingTimeMinutes = Math.round(
    readingSessions.reduce((sum, session) => sum + Number(session.duration_seconds || 0), 0) / 60
  );
  const booksCompleted = readingProgress.filter((p) => Number(p.percentage || 0) >= 95).length;

  const uniqueDays = Array.from(
    new Set(readingSessions.map((s) => new Date(s.started_at).toISOString().slice(0, 10)))
  );

  let dailyReadingStreak = 0;
  for (let i = 0; ; i++) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    if (uniqueDays.includes(key)) {
      dailyReadingStreak += 1;
    } else {
      break;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8 text-center">
          My Profile
        </h1>

        <div className="bg-card rounded-xl p-8 shadow-book border border-border space-y-6">
          {/* Reading Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-secondary rounded-lg p-4 text-center">
              <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wide">Total Reading Time</h3>
              <p className="font-display text-2xl font-bold">{totalReadingTimeMinutes}m</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wide">Books Completed</h3>
              <p className="font-display text-2xl font-bold">{booksCompleted}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wide">Daily Streak</h3>
              <p className="font-display text-2xl font-bold">{dailyReadingStreak}</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Avatar" />
                ) : null}
                <AvatarFallback className="text-2xl font-display font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 flex items-center justify-center bg-foreground/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-background animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-background" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <p className="font-body text-xs text-muted-foreground">
              Click to change avatar (max 2MB)
            </p>
          </div>

          {/* Display Name */}
          <div>
            <Label htmlFor="displayName" className="font-body text-sm">
              Display Name
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 font-body"
              maxLength={100}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <Label className="font-body text-sm">Email</Label>
            <Input
              value={user?.email || ""}
              disabled
              className="mt-1 font-body opacity-60"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full font-body font-semibold"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
