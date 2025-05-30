import Header from "@/components/LandingPage/Header";
import BookingProvider from "@/components/providers/BookProvider";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <BookingProvider>
      <div className="relative">
        <Header />
        {children}
      </div>
    </BookingProvider>
  );
}
