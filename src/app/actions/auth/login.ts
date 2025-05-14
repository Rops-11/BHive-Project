"use server";

import bcrypt from "bcrypt";
import { z } from "zod";
import { cookies } from "next/headers";
import { prisma } from "utils/db";
import { redirect } from "next/navigation";
import { createClient } from "utils/supabase/server";

const STAFF_SESSION_COOKIE_NAME = "_Secure-bhivehotelwebsite_staff_session";
const FULLNAME_COOKIE_NAME = "staff_fullName";

const LoginFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required." })
    .transform((val) => val.toLowerCase()),
  password: z.string().min(1, { message: "Password is required." }),
  redirectTo: z.string().optional(),
});

export type LoginFormState = {
  message: string | null;
  errors?: {
    username?: string[];
    password?: string[];
    general?: string[];
  };
  success: boolean;
};

export async function loginUser(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo") || "/admin",
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { username, password, redirectTo } = validatedFields.data;

  try {
    const staff = await prisma.staff.findUnique({
      where: { username: username },
    });

    if (!staff) {
      return {
        message: "Invalid username or password.",
        success: false,
        errors: { general: ["Invalid username or password."] },
      };
    }

    const passwordsMatch = await bcrypt.compare(password, staff.passwordHash);

    if (!passwordsMatch) {
      return {
        message: "Invalid username or password.",
        success: false,
        errors: { general: ["Invalid username or password."] },
      };
    }

    const cookieStore = await cookies();
    const oneDay = 24 * 60 * 60 * 1000;

    cookieStore.set(STAFF_SESSION_COOKIE_NAME, staff.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + oneDay),
    });

    if (staff.fullName) {
      cookieStore.set(FULLNAME_COOKIE_NAME, staff.fullName, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + oneDay),
        httpOnly: false,
      });
    } else {
      cookieStore.delete(FULLNAME_COOKIE_NAME);
    }

    console.log(
      `Staff ${
        staff.fullName || staff.username
      } logged in successfully. Redirecting to ${redirectTo}`
    );

    if (redirectTo) redirect(redirectTo);
    else redirect("/admin");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Login processing error:", error);
    let errorMessage = "An unexpected error occurred during login processing.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      message: errorMessage,
      success: false,
      errors: { general: [errorMessage] },
    };
  }
}

export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete(STAFF_SESSION_COOKIE_NAME);
  cookieStore.delete(FULLNAME_COOKIE_NAME);

  redirect("/auth");
}
