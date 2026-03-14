# Ebook Store — Replit Project

## Overview

A full-featured ebook marketplace built with React + Vite + TypeScript, backed by Supabase for authentication, database, and storage. Users can browse books, purchase them via Stripe, read EPUBs in-browser, write reviews, manage wishlists, and track reading progress.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Auth + Database + Storage**: Supabase (auth, postgres, storage buckets)
- **Payments**: Stripe (via Supabase Edge Functions)
- **State**: Zustand (auth store, cart store, wishlist store)
- **Data fetching**: TanStack React Query
- **Routing**: React Router v6
- **i18n**: react-i18next (English, Arabic, Spanish, French, Portuguese, Chinese)
- **EPUB reader**: epub.js

## Project Structure

```
src/
  assets/          # Book cover images, hero banner, logo
  components/      # Shared UI components (Navbar, Footer, BookCard, EpubReader, etc.)
  components/ui/   # shadcn/ui primitives
  contexts/        # AuthContext (legacy, use auth-store instead)
  hooks/           # Data hooks (use-books, use-reviews, use-purchases, use-reader, etc.)
  i18n/            # Translations (en, ar, es, fr, pt, zh)
  integrations/
    supabase/      # Supabase client + TypeScript types
    lovable/       # Stub only — Lovable OAuth removed during migration
  lib/             # Utilities
  pages/           # Route pages (Index, Browse, BookDetail, Cart, Auth, Admin/*, etc.)
  pages/admin/     # Admin panel (Dashboard, Books, Orders, Users)
  stores/          # Zustand stores (auth-store, cart-store, wishlist-store)
  types/           # TypeScript types (Book, I18nField, epubjs types)
supabase/
  functions/       # Edge functions (create-checkout, serve-ebook, stripe-webhook, translate-books)
  migrations/      # SQL migrations for the full schema
```

## Environment Variables

These must be set as Replit Secrets:

| Secret | Description |
|--------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public API key |

For full payment functionality, Supabase Edge Functions also need:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

## Running the App

```bash
npm run dev
```

Runs on port 5000 (Replit webview).

## Database Schema (Supabase)

Tables: `books`, `profiles`, `purchases`, `reviews`, `wishlists`, `user_roles`, `reading_progress`, `reader_bookmarks`, `reader_highlights`, `reading_sessions`

Migrations are in `supabase/migrations/` and should be applied to the Supabase project directly.

## Key Features

- Public book catalog with search, filter by category, i18n
- User auth (email/password via Supabase)
- Shopping cart (Zustand, persisted)
- Stripe checkout via Supabase Edge Function
- EPUB reader with progress tracking, bookmarks, highlights
- Wishlist and purchase history
- Admin panel (books CRUD, orders, users)
- Book review system with ratings

## Migration Notes (Lovable → Replit)

- Removed `lovable-tagger` and `@lovable.dev/cloud-auth-js` packages
- Replaced Lovable's component tagger in `vite.config.ts` with a clean config
- `src/integrations/lovable/index.ts` is now a safe stub (Google/Apple OAuth via Lovable is unavailable)
- Vite dev server updated: host `0.0.0.0`, port `5000` for Replit webview compatibility
- Supabase Edge Functions remain unchanged and still handle payments/ebook serving
