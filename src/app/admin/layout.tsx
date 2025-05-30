"use client";

import AdminHeader from "@/components/Admin/Header/AdminHeader";
import AuthProvider from "@/components/providers/AuthProvider";
import BookingProvider from "@/components/providers/BookProvider";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BookingProvider>
        <div className="flex w-full relative">
          <AdminHeader />
          {children}
        </div>
      </BookingProvider>
    </AuthProvider>
  );
}
