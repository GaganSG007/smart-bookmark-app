# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Save, organize, and sync your favorite links instantly across devices.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Setup & Quick Start](#setup--quick-start)
6. [Deployment](#deployment)
7. [Problems Encountered & Solutions](#problems-encountered--solutions)
8. [Project Structure](#project-structure)
9. [Database Schema](#database-schema)
10. [Authentication Flow](#authentication-flow)
11. [Security Features](#security-features)
12. [Troubleshooting](#troubleshooting)
13. [License & Support](#license--support)

---

## Project Overview

This app lets users securely save bookmarks, organize them, and access them from any device. It uses Google OAuth for authentication, Supabase for backend and real-time sync, and Next.js for a modern UI.

---

## Features

- Google OAuth sign-in (no passwords)
- Add, view, delete bookmarks
- Real-time sync across tabs/devices
- Responsive design (mobile & desktop)
- Row-level security (Supabase RLS)
- Undo delete (snackbar)
- Onboarding tooltip
- Optimistic UI updates
- Cross-tab sync (BroadcastChannel + localStorage fallback)
- Bookmarks card UI (favicon, excerpt, quick actions)

---

## Tech Stack

- Next.js 15+ (App Router, TypeScript)
- Tailwind CSS
- Supabase (Postgres, Auth, Realtime)
- Vercel (deployment)

---

## Architecture

- **Frontend:** Next.js App Router, client components for dashboard, login, add form, bookmarks list
- **Backend:** Supabase (Postgres DB, Auth, Realtime)
- **Auth:** Google OAuth via Supabase
- **Realtime:** Supabase Realtime + BroadcastChannel/localStorage for cross-tab sync
- **State:** React Context for auth/session
- **UI:** Tailwind CSS, custom cards, snackbar, tooltips

---

## Setup & Quick Start

1. Copy `.env.example` to `.env.local` and set:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

2. Ensure Supabase project has Google OAuth enabled with redirect URI:
   `http://localhost:3000/auth/callback`

3. Install dependencies and run locally:

   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

For full setup, deployment, and SQL schema, see `DEPLOYMENT_GUIDE.md` and `DATABASE_SETUP.sql`.

---

## Deployment

1. Push to GitHub
2. Deploy to Vercel
3. Add environment variables in Vercel dashboard
4. Update Google OAuth redirect URI for production

---

## Problems Encountered & Solutions

### 1. OAuth Redirect Loop
**Problem:** After Google sign-in, app redirected to login repeatedly.
**Solution:** Fixed callback route to always redirect to dashboard and enabled `detectSessionInUrl` in Supabase client. Session is now detected from URL hash.

### 2. Session Persistence
**Problem:** User session lost on refresh or navigation.
**Solution:** Configured Supabase client with `persistSession` and `autoRefreshToken`. Added custom AuthProvider using `supabase.auth.getSession` and `onAuthStateChange`.

### 3. Real-time Sync Delay Across Tabs
**Problem:** Bookmarks deleted in one tab didn't update instantly in other (especially split/inactive tabs).
**Solution:** Added BroadcastChannel for cross-tab sync and localStorage fallback for inactive/split tabs. Optimistic UI updates and explicit broadcasts for insert/delete.

### 4. Undo Delete & UI Feedback
**Problem:** No way to undo accidental deletes; UI felt abrupt.
**Solution:** Implemented optimistic delete, undo snackbar (re-inserts bookmark), subtle hover animation, onboarding tooltip, and improved bookmark card UI.

### 5. Input Text Color
**Problem:** Typed text in add form was not black, causing readability issues.
**Solution:** Forced input text color to black via inline style and Tailwind class.

### 6. Security: Exposed Credentials
**Problem:** Early docs exposed Supabase keys and Google secrets.
**Solution:** Removed all secrets from docs, rotated keys, and ensured `.env.local` is in `.gitignore`.

### 7. Vercel Deployment Failures
**Problem:** Several Vercel deploys failed due to missing env vars or SSR/browser global usage.
**Solution:** Ensured all env vars are set in Vercel dashboard, fixed client/server code separation, and updated troubleshooting docs.

---

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Home page (redirects to login)
│   ├── login/
│   │   └── page.tsx            # Login page with Google OAuth
│   ├── dashboard/
│   │   └── page.tsx            # Main app dashboard
│   └── auth/
│       └── callback/
│           └── route.ts        # OAuth callback handler
├── lib/
│   ├── auth-context.tsx        # Auth state management
│   ├── supabase-client.ts      # Client-side Supabase instance
│   └── tab-sync.ts             # Cross-tab sync helpers
├── components/
│   ├── add-bookmark-form.tsx   # Form to add bookmarks
│   ├── bookmarks-list.tsx      # List display with real-time updates
│   ├── snackbar.tsx            # Undo snackbar
│   └── onboarding-tooltip.tsx  # Onboarding tooltip
├── .env.example                # Environment variable template
├── DATABASE_SETUP.sql          # SQL for table & RLS
├── DEPLOYMENT_GUIDE.md         # Full deployment steps
└── package.json
```

---

## Database Schema

### `bookmarks` Table

| Column     | Type    | Description                  |
|------------|---------|------------------------------|
| id         | UUID    | Primary key                  |
| user_id    | UUID    | Foreign key to auth.users    |
| title      | TEXT    | Bookmark title               |
| url        | TEXT    | Bookmark URL                 |
| created_at | TIMESTAMP| Creation timestamp           |

---

## Authentication Flow

1. User clicks "Sign in with Google" on login page
2. Redirected to Google OAuth consent screen
3. After approval, redirected to `/auth/callback` with authorization code
4. Callback route exchanges code for session
5. AuthProvider updates state
6. User is logged in and can access dashboard
7. User can now add/view/delete bookmarks

---

## Security Features

- Google OAuth: No password storage
- Row Level Security: Database-level access control
- Private bookmarks: Each user can only access their own bookmarks
- URL validation: Prevents invalid data entry
- Session management: Secure session handling via Supabase

---

## Troubleshooting

### Login redirects repeatedly
- Check if Google OAuth credentials are correctly set in Supabase
- Verify callback URL matches in Google Cloud Console

### Bookmarks don't appear after adding
- Check browser console for errors
- Verify Supabase environment variables are correct
- Ensure RLS policies are properly configured

### Real-time updates not working
- Ensure Supabase project has Realtime enabled
- Check browser supports WebSocket connections
- Verify network tab for failed subscriptions

### Vercel deployment shows blank page
- Check environment variables are added to Vercel
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check browser console for errors

---

## License & Support

MIT

For issues, please open a GitHub issue in the repository.

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
