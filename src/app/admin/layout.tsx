"use client";

import AdminHeader from "@/components/Admin/AdminHeader";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full relative">
      <AdminHeader />
      {children}
    </div>
  );
}
