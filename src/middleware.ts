import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const PROTECTED_PATHS = ["/admin"];
const GOOGLE_AUTH_PATH = "/auth";
const STAFF_AUTH_PATH = "/auth/staff-auth";
const STAFF_SESSION_COOKIE_NAME = "_Secure-bhivehotelwebsite_staff_session";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session: supabaseSession },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error(
      "Middleware: Error getting Supabase session:",
      sessionError.message
    );
  }

  const staffSessionCookie = request.cookies.get(
    STAFF_SESSION_COOKIE_NAME
  )?.value;
  const currentPath = request.nextUrl.pathname;

  const isProtectedPath = PROTECTED_PATHS.some(
    (path) => currentPath === path || currentPath.startsWith(`${path}/`)
  );

  if (isProtectedPath) {
    if (!supabaseSession) {
      const loginUrl = new URL(GOOGLE_AUTH_PATH, request.url);
      loginUrl.searchParams.set("redirectTo", currentPath);
      loginUrl.searchParams.set(
        "message",
        "Please sign in with Google to continue."
      );
      console.log(
        `Middleware: No Supabase session for protected path ${currentPath}. Redirecting to ${loginUrl.toString()}`
      );
      return NextResponse.redirect(loginUrl);
    }
    if (!staffSessionCookie) {
      const staffLoginUrl = new URL(STAFF_AUTH_PATH, request.url);
      staffLoginUrl.searchParams.set("redirectTo", currentPath);
      staffLoginUrl.searchParams.set(
        "message",
        "Please complete staff authentication."
      );
      console.log(
        `Middleware: Supabase session OK, but no staff session for protected path ${currentPath}. Redirecting to ${staffLoginUrl.toString()}`
      );
      return NextResponse.redirect(staffLoginUrl);
    }
    return response;
  }

  if (
    currentPath === STAFF_AUTH_PATH ||
    currentPath.startsWith(`${STAFF_AUTH_PATH}/`)
  ) {
    if (!supabaseSession) {
      const loginUrl = new URL(GOOGLE_AUTH_PATH, request.url);
      const redirectTo =
        request.nextUrl.searchParams.get("redirectTo") || "/admin";
      loginUrl.searchParams.set("redirectTo", redirectTo);
      loginUrl.searchParams.set("message", "Please sign in with Google first.");
      return NextResponse.redirect(loginUrl);
    }
    if (supabaseSession && staffSessionCookie) {
      const redirectTo =
        request.nextUrl.searchParams.get("redirectTo") || "/admin";

      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return response;
  }

  if (
    currentPath === GOOGLE_AUTH_PATH ||
    currentPath.startsWith(`${GOOGLE_AUTH_PATH}/`)
  ) {
    if (supabaseSession && staffSessionCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (supabaseSession && !staffSessionCookie) {
      const staffLoginUrl = new URL(STAFF_AUTH_PATH, request.url);
      const redirectTo =
        request.nextUrl.searchParams.get("redirectTo") || "/admin";
      staffLoginUrl.searchParams.set("redirectTo", redirectTo);
      
      return NextResponse.redirect(staffLoginUrl);
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
