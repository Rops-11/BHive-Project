"use server";
import { createClient } from "utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClient();

  const requiredScopes = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/gmail.readonly",
    // "offline_access",
  ];
  const scopesString = requiredScopes.join(" ");

  console.log("Requesting Google OAuth with scopes:", scopesString);

  const appURL = process.env.APP_URL;
  if (!appURL) {
    console.error(
      "APP_URL environment variable is not set. OAuth redirection might fail."
    );
    return { error: "Server configuration error: APP_URL is not set." };
  }

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${appURL}/api/auth/callback`,
      scopes: scopesString,
    },
  });

  if (error) {
    console.error("Supabase signInWithOAuth error:", error);

    return { error: `Failed to initiate Google sign-in: ${error.message}` };
  }

  if (data.url) {
    console.log("Redirecting to Google OAuth URL:", data.url);
    redirect(data.url);
  } else {
    console.warn(
      "signInWithOAuth did not return a URL. Redirecting to /admin as fallback."
    );
    redirect("/admin");
  }
}
