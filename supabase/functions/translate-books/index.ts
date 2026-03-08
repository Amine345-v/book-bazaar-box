import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LANGUAGES = ["ar", "es", "fr", "pt", "zh"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Optionally accept { bookId } to translate a single book
    let bookId: string | undefined;
    try {
      const body = await req.json();
      bookId = body?.bookId;
    } catch { /* no body = translate all */ }

    let query = supabaseAdmin.from("books").select("id, title, description, category, format");
    if (bookId) {
      query = query.eq("id", bookId);
    }

    const { data: books, error } = await query;
    if (error) throw error;
    if (!books || books.length === 0) {
      return new Response(JSON.stringify({ message: "No books to translate" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let translated = 0;

    for (const book of books) {
      const prompt = `Translate the following book information into these languages: ${LANGUAGES.join(", ")}.

Book data:
- Title: ${book.title}
- Description: ${book.description}
- Category: ${book.category}
- Format: ${book.format}

Return the translations using the suggest_translations tool.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a professional translator. Translate book metadata accurately, preserving meaning and tone. For category names, use the standard publishing category name in each language. For format (e.g. 'EPUB, PDF'), keep the format names as-is since they are technical terms, but translate any surrounding words.",
            },
            { role: "user", content: prompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "suggest_translations",
                description: "Return translations for all fields in all target languages.",
                parameters: {
                  type: "object",
                  properties: {
                    title: {
                      type: "object",
                      properties: {
                        ar: { type: "string" },
                        es: { type: "string" },
                        fr: { type: "string" },
                        pt: { type: "string" },
                        zh: { type: "string" },
                      },
                      required: ["ar", "es", "fr", "pt", "zh"],
                    },
                    description: {
                      type: "object",
                      properties: {
                        ar: { type: "string" },
                        es: { type: "string" },
                        fr: { type: "string" },
                        pt: { type: "string" },
                        zh: { type: "string" },
                      },
                      required: ["ar", "es", "fr", "pt", "zh"],
                    },
                    category: {
                      type: "object",
                      properties: {
                        ar: { type: "string" },
                        es: { type: "string" },
                        fr: { type: "string" },
                        pt: { type: "string" },
                        zh: { type: "string" },
                      },
                      required: ["ar", "es", "fr", "pt", "zh"],
                    },
                    format: {
                      type: "object",
                      properties: {
                        ar: { type: "string" },
                        es: { type: "string" },
                        fr: { type: "string" },
                        pt: { type: "string" },
                        zh: { type: "string" },
                      },
                      required: ["ar", "es", "fr", "pt", "zh"],
                    },
                  },
                  required: ["title", "description", "category", "format"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "suggest_translations" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.error("Rate limited, stopping. Translated so far:", translated);
          break;
        }
        console.error("AI error for book", book.id, response.status);
        continue;
      }

      const result = await response.json();
      const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) {
        console.error("No tool call returned for book", book.id);
        continue;
      }

      const translations = JSON.parse(toolCall.function.arguments);

      // Add English originals
      const titleI18n = { en: book.title, ...translations.title };
      const descriptionI18n = { en: book.description, ...translations.description };
      const categoryI18n = { en: book.category, ...translations.category };
      const formatI18n = { en: book.format, ...translations.format };

      const { error: updateError } = await supabaseAdmin
        .from("books")
        .update({
          title_i18n: titleI18n,
          description_i18n: descriptionI18n,
          category_i18n: categoryI18n,
          format_i18n: formatI18n,
        })
        .eq("id", book.id);

      if (updateError) {
        console.error("Update error for book", book.id, updateError);
        continue;
      }

      translated++;
      // Small delay to avoid rate limiting
      if (books.length > 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    return new Response(JSON.stringify({ message: `Translated ${translated} books` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate-books error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
