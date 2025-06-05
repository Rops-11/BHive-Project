import { defineConfig } from "cypress";
import { PrismaClient } from "@prisma/client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(isAdminContext = false) {
  const cookieStore = await cookies();

  if (isAdminContext && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

const prisma = new PrismaClient();

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on("task", {
        async deleteLatestBooking() {
          try {
            const latestBooking = await prisma.booking.findFirst({
              orderBy: {
                dateBooked: "desc",
              },
            });

            if (latestBooking) {
              await prisma.booking.delete({
                where: {
                  id: latestBooking.id,
                },
              });
              console.log(
                `Successfully deleted booking with ID: ${latestBooking.id}`
              );
              return { success: true, bookingId: latestBooking.id };
            } else {
              console.log("No bookings found to delete.");
              return { success: false, message: "No bookings found" };
            }
          } catch (error) {
            console.error("Error deleting latest booking:", error);

            return {
              success: false,
              error: (error as Error).message || "Unknown error",
            };
          }
        },

        // async loginToGmail() {
        //   const supabase = await createClient()

        //   await supabase.auth.signInWithOAuth()
        // },
      });
    },
  },
});
