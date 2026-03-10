import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user with their token
    const userClient = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { bookId } = await req.json();
    if (!bookId) {
      return new Response(JSON.stringify({ error: "bookId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check purchase with service role
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: purchase } = await adminClient
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .eq("status", "completed")
      .maybeSingle();

    if (!purchase) {
      return new Response(
        JSON.stringify({ error: "Book not purchased" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get epub_key from books
    const { data: book } = await adminClient
      .from("books")
      .select("epub_key")
      .eq("id", bookId)
      .single();

    if (!book?.epub_key) {
      return new Response(
        JSON.stringify({ error: "No ebook file available" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Stream the file from private bucket
    const { data: fileData, error: fileError } = await adminClient.storage
      .from("ebooks")
      .download(`${bookId}/${book.epub_key}`);

    if (fileError || !fileData) {
      return new Response(
        JSON.stringify({ error: "File not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return the epub as binary with watermark header
    const arrayBuffer = await fileData.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/epub+zip",
        "X-Watermark": `uid:${user.id}:${Date.now()}`,
        "Cache-Control": "no-store, no-cache",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
