# ⚠️ SECURITY ALERT & FIX

## Issue Found
Your Supabase credentials were exposed in DEPLOYMENT_GUIDE.md. This has been removed.

## Required Actions

### 1. REGENERATE Your Supabase Keys
Since your keys were exposed, you need to generate new ones:

1. Go to Supabase Dashboard
2. Go to **Settings** → **API**
3. Click the button to regenerate your `anon public` key
4. Copy the NEW key

### 2. Update `.env.local`
Edit the file: `.env.local`

Replace the placeholder values with your ACTUAL Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-name.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key_here
```

Where:
- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL from Settings → API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your NEW anon public key (after regeneration)

### 3. Verify Google OAuth Redirect URL
Make sure in Supabase:
1. Go to **Authentication** → **Providers** → **Google**
2. The Redirect URL should show your callback endpoint
3. This URL should be added to Google Cloud console

### 4. Restart Your App
```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

## What Was Fixed

1. ✅ Removed exposed credentials from DEPLOYMENT_GUIDE.md
2. ✅ Fixed OAuth callback route to properly handle Supabase session
3. ✅ Enabled session persistence in Supabase client
4. ✅ Added proper auth config for detectSessionInUrl

## Test OAuth Flow

After updating `.env.local`:

1. Go to http://localhost:3000
2. Click "Sign in with Google"
3. Select your Gmail account
4. **You should now be redirected to dashboard (not login page)**

## Why This Fixes It

- **detectSessionInUrl: true** - Tells Supabase to detect the session from the URL after OAuth redirect
- **persistSession: true** - Keeps the session stored in browser
- **autoRefreshToken: true** - Automatically refreshes expired tokens
- **Updated callback route** - Properly handles the OAuth code exchange

## If It Still Doesn't Work

Check these:
1. Are your env vars correct? (Check .env.local)
2. Is your Supabase project URL correct?
3. Is your anon key correct?
4. Are your Google OAuth credentials correct in Supabase?
5. Check browser console (F12) for error messages

## Security Notes

- Never commit credentials to Git (they're in .gitignore ✅)
- The .env.local file is local-only and protected
- Don't share your credentials with anyone
- Use environment variables in Vercel for production
