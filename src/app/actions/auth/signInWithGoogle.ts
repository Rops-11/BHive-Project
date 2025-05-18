"use server";
import { createClient } from "utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClient();

  const gmailScopes = ["https://www.googleapis.com/auth/gmail.readonly"].join(
    " "
  );

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.APP_URL}/api/auth/callback`,
      scopes: gmailScopes,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  } else {
    redirect("/admin/staff-auth");
  }
}
