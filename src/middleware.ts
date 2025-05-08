import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// List of paths that require authentication
const protectedPaths = ["/admin"];

export async function middleware(request: NextRequest) {
  // Create a response object that we can modify
  const response = NextResponse.next();

  // Create a Supabase client specifically for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          return request.cookies.get(name)?.value;
        },
        set: (name, value, options) => {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(`${path}/`)
  );

  console.log(isProtectedPath);
  console.log(session);

  // If on a protected path and no session, redirect to login
  if (isProtectedPath && !session) {
    const redirectUrl = new URL("/login", request.url);
    // Store the original URL to redirect back after login
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Update the session if needed
  await updateSession(request, response);

  return response;
}

async function updateSession(request: NextRequest, response: NextResponse) {
  // Add your session update logic here if needed
  // This is a placeholder for the updateSession function
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
