# Smart Bookmark App

A compact showcase of a real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Quick Showcase (what you need for the assessment)

- Copy `.env.example` to `.env.local` and set the two required values:

  ```env
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
  ```

- Ensure your Supabase project has Google OAuth enabled with redirect URI:
  `http://localhost:3000/auth/callback` (for local showcase).

- Install and run locally:

  ```bash
  npm install
  npm run dev
  ```

- Open: http://localhost:3000 and sign in with Google to demonstrate adding/deleting bookmarks and real-time sync across tabs.

For the full setup, deployment details, and SQL schema, see `DEPLOYMENT_GUIDE.md` and `DATABASE_SETUP.sql`.

## Features (short)

- Google OAuth sign-in
- Add, view, delete bookmarks
- Real-time sync across tabs/devices
- Row-level security (Supabase RLS)

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- Supabase (Auth, Realtime, Postgres)

## Troubleshooting (short)

- Login loop: verify Google OAuth credentials and callback URI in Supabase/Google Cloud
- Missing bookmarks: confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

---

For more details (database schema, full deployment steps, troubleshooting history), consult `DEPLOYMENT_GUIDE.md`, `DATABASE_SETUP.md`, or open the full README on the repo.

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
