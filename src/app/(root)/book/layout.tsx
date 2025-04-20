"use client";
import BookingProvider from "@/components/providers/BookProvider";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingProvider>
      <div>{children}</div>
    </BookingProvider>
  );
}
