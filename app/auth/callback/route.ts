import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  // With detectSessionInUrl: true, Supabase client automatically detects tokens
  // from the URL hash (#access_token=...). We just need to redirect so the
  // client-side auth context can pick up the session.
  const next = requestUrl.searchParams.get("next") || "/dashboard";
  
  // Always redirect to dashboard (or specified next page)
  // The Supabase client will detect the session from URL hash
  return NextResponse.redirect(new URL(next, request.url));
}
