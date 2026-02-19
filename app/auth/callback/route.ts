import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      // The session is already set by Supabase's OAuth callback
      // Redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      console.error("Auth callback error:", error);
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
}
