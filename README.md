# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Save and organize your favorite links with instant synchronization across devices.

## Features

✨ **Google OAuth Authentication** - Secure sign-in with your Google account (no password required)
📑 **Add Bookmarks** - Save URLs with custom titles
🔒 **Private Bookmarks** - Your bookmarks are completely private and visible only to you
⚡ **Real-time Sync** - Changes appear instantly across all open tabs and devices
🗑️ **Delete Bookmarks** - Remove bookmarks you no longer need
📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- A Google Cloud project for OAuth

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd smart-bookmark-app
npm install
```

#### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. Go to **SQL Editor** and run the following SQL to create the bookmarks table:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT user_bookmarks_unique UNIQUE (user_id, url)
);

-- Create RLS policies
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_created_at_idx ON bookmarks(created_at);
```

4. Go to **Project Settings** → **API** to find your:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Go to **Authentication** → **Providers** and enable Google OAuth:
   - Click "Google"
   - Add your Google OAuth credentials from Google Cloud Console
   - Set Redirect URL to `http://localhost:3000/auth/callback` (update for production)

#### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### 4. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
6. Copy Client ID and Client Secret to Supabase Google provider settings

#### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the login page.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"
6. Update Google OAuth redirect URI in Supabase to: `https://your-vercel-deployment.vercel.app/auth/callback`

## Problems Encountered & Solutions

### 1. **Real-time Updates Not Working Across Tabs**

**Problem**: Bookmarks added in one tab weren't appearing in another tab without page refresh.

**Solution**: Implemented Supabase Realtime subscriptions in the `BookmarksList` component. The component subscribes to postgres_changes events for the bookmarks table and updates state in real-time.

### 2. **Deprecated Auth Helper Package**

**Problem**: The `@supabase/auth-helpers-nextjs` package was deprecated and no longer supported.

**Solution**: Switched to using `@supabase/supabase-js` with `@supabase/ssr` for better Next.js 13+ App Router support. Implemented custom auth context using React's Context API.

### 3. **Privacy/Row Level Security Issues**

**Problem**: Initially, database queries weren't filtering by user ID, which could expose other users' bookmarks.

**Solution**: Implemented proper RLS (Row Level Security) policies in Supabase ensuring users can only access their own bookmarks.

### 4. **Authentication Persistence**

**Problem**: User session was lost on page refresh.

**Solution**: Created a custom AuthProvider that checks for existing sessions on app load and subscribes to auth state changes using Supabase's built-in session management.

### 5. **URL Validation**

**Problem**: Users could submit invalid URLs, causing issues.

**Solution**: Added client-side URL validation using the `URL()` constructor before submission with user-friendly error messages.

### 6. **Environment Variables Not Loaded in Vercel**

**Problem**: Deployment failed because environment variables weren't properly configured.

**Solution**: Ensured all environment variables are prefixed with `NEXT_PUBLIC_` (since they're used client-side) and added them to Vercel project settings.

## Problems Encountered & Solutions

### 1. **Real-time Updates Not Working Across Tabs**

**Problem**: Bookmarks added in one tab weren't appearing in another tab without page refresh.

**Solution**: Implemented Supabase Realtime subscriptions in the `BookmarksList` component. The component subscribes to postgres_changes events for the bookmarks table and updates state in real-time.

### 2. **Deprecated Auth Helper Package**

**Problem**: The `@supabase/auth-helpers-nextjs` package was deprecated and no longer supported.

**Solution**: Switched to using `@supabase/supabase-js` with `@supabase/ssr` for better Next.js 13+ App Router support. Implemented custom auth context using React's Context API.

### 3. **Privacy/Row Level Security Issues**

**Problem**: Initially, database queries weren't filtering by user ID, which could expose other users' bookmarks.

**Solution**: Implemented proper RLS (Row Level Security) policies in Supabase ensuring users can only access their own bookmarks.

### 4. **Authentication Persistence**

**Problem**: User session was lost on page refresh.

**Solution**: Created a custom AuthProvider that checks for existing sessions on app load and subscribes to auth state changes using Supabase's built-in session management.

### 5. **URL Validation**

**Problem**: Users could submit invalid URLs, causing issues.

**Solution**: Added client-side URL validation using the `URL()` constructor before submission with user-friendly error messages.

### 6. **Environment Variables Not Loaded in Vercel**

**Problem**: Deployment failed because environment variables weren't properly configured.

**Solution**: Ensured all environment variables are prefixed with `NEXT_PUBLIC_` (since they're used client-side) and added them to Vercel project settings.

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
│   └── protected-route.tsx     # Route protection wrapper
├── components/
│   ├── add-bookmark-form.tsx   # Form to add bookmarks
│   └── bookmarks-list.tsx      # List display with real-time updates
├── .env.example                # Environment variable template
└── package.json
```

## Database Schema

### `bookmarks` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| title | TEXT | Bookmark title |
| url | TEXT | Bookmark URL |
| created_at | TIMESTAMP | Creation timestamp |

## Authentication Flow

1. User clicks "Sign in with Google" on login page
2. Redirected to Google OAuth consent screen
3. After approval, redirected to `/auth/callback` with authorization code
4. Callback route exchanges code for session
5. AuthProvider updates state
6. User is logged in and can access dashboard
7. User can now add/view/delete bookmarks

## Real-time Features

The app uses Supabase Realtime to push changes instantly:

- **INSERT events**: New bookmarks appear immediately when added
- **DELETE events**: Bookmark removal is reflected instantly
- **Subscription cleanup**: Properly unsubscribe when component unmounts

## Testing Real-time Across Tabs

1. Open the app in two browser tabs
2. Log in with the same Google account in both tabs
3. Add a bookmark in one tab
4. Watch it appear instantly in the other tab without refresh
5. Delete a bookmark and see it disappear in real-time

## Security Features

- **Google OAuth**: No password storage
- **Row Level Security**: Database-level access control
- **Private bookmarks**: Each user can only access their own bookmarks
- **URL validation**: Prevents invalid data entry
- **Session management**: Secure session handling via Supabase

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

## License

MIT

## Support

For issues, please open a GitHub issue in the repository.

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
