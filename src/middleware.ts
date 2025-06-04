import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const PROTECTED_PATHS = ["/admin"]; 
const PUBLIC_PATHS = ["/auth"]; 

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
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

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error(
      "Middleware: Error getting/refreshing session:",
      sessionError.message
    );
  }

  const { pathname } = request.nextUrl;

  const isProtectedPath = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtectedPath && !session) {
    const redirectUrl = new URL("/auth", request.url); 
    redirectUrl.searchParams.set("redirectTo", pathname);
    console.log(
      `Middleware: No session for protected path ${pathname}. Redirecting to ${redirectUrl.toString()}`
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (session && PUBLIC_PATHS.includes(pathname)) {
     const defaultAuthenticatedRedirect = "/admin"; 
     console.log(
      `Middleware: Authenticated user on public auth path ${pathname}. Redirecting to ${defaultAuthenticatedRedirect}`
    );
    return NextResponse.redirect(new URL(defaultAuthenticatedRedirect, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - specifically allow /api/auth/callback
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any other public static assets
     * Ensure /api/auth/callback is NOT matched by the general /api exclusion if you have one.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    // If you have /api routes you want to protect, add them specifically or adjust the negative lookahead.
    // Crucially, /api/auth/callback MUST be allowed to pass through without interference.
    // If your callback is /api/auth/callback, the above matcher should be fine.
  ],
};