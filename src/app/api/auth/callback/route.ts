import { NextResponse } from "next/server";
import { createClient } from "@/../utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const staffAuthUrl = new URL("/auth/staff-auth", origin);
      staffAuthUrl.searchParams.set("redirectTo", next);

      console.log(
        `OAuth callback successful. Redirecting to staff auth: ${staffAuthUrl.toString()}`
      );
      return NextResponse.redirect(staffAuthUrl.toString());
    }
    console.error("OAuth callback error exchanging code:", error.message);
  } else {
    console.error("OAuth callback: No code found in searchParams.");
  }

  const errorUrl = new URL("/auth/auth-code-error", origin);
  errorUrl.searchParams.set(
    "message",
    "Failed to complete Google sign-in. Please try again."
  );
  return NextResponse.redirect(errorUrl.toString());
}
