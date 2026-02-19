# Quick Start Guide

## Before You Begin

Make sure you have:
1. Node.js 18+ installed (check: `node --version`)
2. npm installed (check: `npm --version`)
3. Supabase account with credentials
4. Google OAuth credentials from Google Cloud Console

## Local Development Setup

### Step 1: Clone/Setup Project

```bash
cd "C:\Users\Spidey's Beast\Desktop\Smart Bookmark App\smart-bookmark-app"
npm install
```

### Step 2: Configure Environment

Create `.env.local` file (if not exists) with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Get these values from Supabase Dashboard → Settings → API

### Step 3: Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### Step 4: Test the App

1. Click "Sign in with Google"
2. Use your Google account to sign in
3. You should see the dashboard
4. Add a bookmark with a URL and title
5. See it appear in your bookmarks list
6. Delete a bookmark to test that feature

### Step 5: Test Real-time Sync (Optional)

1. Open another browser tab
2. Go to http://localhost:3000 (already logged in)
3. Add a bookmark in one tab
4. Watch it appear instantly in the other tab
5. Delete it and see it disappear in real-time

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Common Issues

### "Missing Supabase environment variables"
- Check `.env.local` exists in project root
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Restart dev server after changing .env.local

### Login page keeps loading
- Check Google OAuth is configured in Supabase
- Verify redirect URL is `http://localhost:3000/auth/callback`
- Check browser console (F12) for error messages

### Bookmarks don't save
- Verify Supabase credentials are correct
- Check database table `bookmarks` exists
- Verify RLS policies are enabled and correct
- Check browser console for API errors

### Real-time updates not working
- Ensure you're logged in on both tabs with same account
- Check browser console for WebSocket errors
- Verify Supabase Realtime is enabled in project

## Project Structure

```
smart-bookmark-app/
├── app/                  # Next.js app routes
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── login/
│   ├── dashboard/
│   └── auth/
├── lib/                 # Utilities & helpers
│   ├── auth-context.tsx # Authentication state
│   └── supabase-client.ts
├── components/          # React components
│   ├── add-bookmark-form.tsx
│   └── bookmarks-list.tsx
├── public/              # Static assets
├── .env.local          # Environment variables (local)
├── .env.example        # Template for env vars
├── package.json        # Dependencies
└── README.md           # Full documentation
```

## Key Features

✨ Google OAuth authentication (no password)
📑 Add bookmarks with URL and title
🔒 Private bookmarks (only you can see yours)
⚡ Real-time updates across tabs
🗑️ Delete bookmarks
📱 Responsive mobile design

## Next Steps

1. Test the app thoroughly locally
2. Follow `DEPLOYMENT_GUIDE.md` for Vercel deployment
3. Share the live URL with others
4. They can sign in with their Google accounts

## Need Help?

1. Check `README.md` for full documentation
2. Check `DEPLOYMENT_GUIDE.md` for setup help
3. Check browser console (F12) for errors
4. Check Supabase dashboard for database issues

---

**You're ready to develop!** 🚀
