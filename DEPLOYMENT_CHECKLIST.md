# Smart Bookmark App - Deployment Checklist

## Phase 1: Supabase Setup

- [ ] Create Supabase project at https://supabase.com/dashboard/
- [ ] Copy `NEXT_PUBLIC_SUPABASE_URL` from Settings → API
- [ ] Copy `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Settings → API
- [ ] Run SQL migration in SQL Editor to create `bookmarks` table
- [ ] Enable RLS on `bookmarks` table
- [ ] Create all 3 RLS policies (SELECT, INSERT, DELETE)
- [ ] Create database indexes for performance
- [ ] Note the Google OAuth redirect URL from Authentication → Providers

## Phase 2: Google Cloud Setup

- [ ] Create Google Cloud project at https://console.cloud.google.com/
- [ ] Enable Google+ API
- [ ] Create OAuth consent screen (External, with app details)
- [ ] Create OAuth 2.0 Client ID (Web application)
- [ ] Add authorized origins:
  - [ ] http://localhost:3000
  - [ ] https://yourdomain.vercel.app (add later after Vercel deployment)
- [ ] Add authorized redirect URIs:
  - [ ] http://localhost:3000/auth/callback
  - [ ] https://yourdomain.supabase.co/auth/v1/callback?provider=google
  - [ ] https://yourdomain.vercel.app/auth/callback (add later)
- [ ] Copy Client ID
- [ ] Copy Client Secret

## Phase 3: Supabase Google OAuth Configuration

- [ ] Go to Supabase Authentication → Providers → Google
- [ ] Paste Client ID from Google Cloud
- [ ] Paste Client Secret from Google Cloud
- [ ] Copy Supabase Redirect URL
- [ ] Add Supabase Redirect URL to Google Cloud OAuth app
- [ ] Save in Supabase

## Phase 4: Local Environment Setup

- [ ] Update `.env.local` with actual Supabase credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
  ```
- [ ] Test locally: `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Test Google OAuth login
- [ ] Add a bookmark
- [ ] Delete a bookmark
- [ ] Test real-time sync in another tab

## Phase 5: GitHub Repository

- [ ] Install Git from https://git-scm.com/download/win
- [ ] Initialize git:
  ```bash
  git config user.name "Your Name"
  git config user.email "your.email@example.com"
  ```
- [ ] Create initial commit:
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Smart Bookmark App"
  ```
- [ ] Create public repository on GitHub at https://github.com/new
- [ ] Push to GitHub:
  ```bash
  git branch -M main
  git remote add origin <YOUR_REPO_URL>
  git push -u origin main
  ```

## Phase 6: Vercel Deployment

- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Click "Import Git Repository"
- [ ] Select `smart-bookmark-app` repository
- [ ] Add Environment Variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Note your Vercel URL (e.g., https://smart-bookmark-app-xxxxx.vercel.app)

## Phase 7: Production Google OAuth Update

- [ ] Go to Google Cloud Console → Credentials
- [ ] Edit your OAuth Client ID
- [ ] Add to Authorized JavaScript Origins:
  - [ ] https://your-vercel-url.vercel.app
- [ ] Add to Authorized Redirect URIs:
  - [ ] https://your-vercel-url.vercel.app/auth/callback
- [ ] Save

## Phase 8: Production Supabase Update

- [ ] Go to Supabase → Authentication → URL Configuration
- [ ] Add to Redirect URLs:
  - [ ] https://your-vercel-url.vercel.app/auth/callback
- [ ] Save

## Phase 9: Production Testing

- [ ] Go to your Vercel URL
- [ ] Click "Sign in with Google"
- [ ] Sign in with your Google account
- [ ] Verify redirected to dashboard
- [ ] Add a bookmark
- [ ] Verify bookmark appears in list
- [ ] Delete a bookmark
- [ ] Verify bookmark is removed
- [ ] Open in another tab with same account
- [ ] Add a bookmark in one tab
- [ ] Verify it appears instantly in the other tab (real-time sync)

## Phase 10: Share & Document

- [ ] Create `.env.local.example` with placeholder values
- [ ] Update README.md with your Vercel URL (optional)
- [ ] Share Vercel URL with others
- [ ] They can sign in with their Google accounts
- [ ] They cannot see each other's bookmarks (privacy verified)

## Important Notes

- Keep Supabase credentials secure (never commit to GitHub)
- `.env.local` is already in `.gitignore` (safe)
- Environment variables are different for local vs production
- Vercel reads `NEXT_PUBLIC_*` variables from project settings
- Real-time sync uses Supabase Realtime subscriptions
- RLS policies enforce privacy at database level

## Troubleshooting References

- See `DEPLOYMENT_GUIDE.md` for detailed troubleshooting steps
- See `README.md` for feature and architecture documentation
- Check browser console (F12) for client-side errors
- Check Vercel logs for deployment issues
- Check Supabase logs for database issues

## Success Criteria

✅ All checkboxes completed = Deployment successful!

Your app will be:
- Deployed on Vercel with a live URL
- Connected to Supabase for data storage
- Using Google OAuth for authentication
- Supporting real-time bookmark sync across tabs/devices
- Completely private (users only see their own bookmarks)
