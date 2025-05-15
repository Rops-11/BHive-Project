"use client";
import BookingProvider from "@/components/providers/BookProvider";

export default function AdminBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingProvider>
      <div className="flex w-full min-h-screen">{children}</div>
    </BookingProvider>
  );
}
