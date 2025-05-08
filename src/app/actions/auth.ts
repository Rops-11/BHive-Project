"use server";

import { redirect } from "next/navigation";

import { createClient, getSession } from "@/../utils/supabase/server";
import { prisma } from "utils/db";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  const { session } = await getSession();
  const userDB = await prisma.user.findFirst({
    where: { id: session?.user.id },
  }); // CAN BE CONTEXT

  return { isAdmin: userDB?.isAdmin };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  if (
    ![
      formData.get("email"),
      formData.get("password"),
      formData.get("confirmPassword"),
    ].every(Boolean)
  ) {
    return { error: "Details Provided is Incomplete" };
  }

  if (formData.get("password") !== formData.get("confirmPassword")) {
    return { error: "Passwords do not match" };
  }

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  const { session } = await getSession();
  await prisma.user.create({ data: { id: session!.user.id } });
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

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
    redirect("/admin");
  }
}
