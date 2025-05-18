"use server";

import bcrypt from "bcrypt";
import { prisma } from "utils/db";
import { z } from "zod";

const SignupFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    })
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export type SignupFormState = {
  message: string | null;
  errors?: {
    fullName?: string[];
    username?: string[];
    password?: string[];
    general?: string[];
  };
  success: boolean;
};

export async function signupUser(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    fullName: formData.get("fullName"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { fullName, username, password } = validatedFields.data;

  try {
    const existingUser = await prisma.staff.findUnique({
      where: { username: username },
    });

    if (existingUser) {
      return {
        message: "Username already taken.",
        errors: { username: ["This username is already in use."] },
        success: false,
      };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.staff.create({
      data: {
        fullName,
        username,
        passwordHash,
      },
    });

    console.log("New user created in DB:", {
      id: newUser.id,
      fullName,
      username,
    });


    return {
      message: "Signup successful! You can now log in.",
      success: true,
    };
  } catch (error) {
    console.error("Signup error:", error);
    let errorMessage = "An unexpected error occurred during signup.";
    if (
      error instanceof Error &&
      error.message.includes(
        "Unique constraint failed on the fields: (`username`)"
      )
    ) {
      errorMessage =
        "This username is already taken. Please choose another one.";
      return {
        message: errorMessage,
        errors: { username: [errorMessage] },
        success: false,
      };
    }
    return {
      message: errorMessage,
      errors: { general: [errorMessage] },
      success: false,
    };
  }
}
