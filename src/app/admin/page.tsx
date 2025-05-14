"use client";

import type React from "react";

import { DashboardTabs } from "@/components/Admin/Dashboard/dashboardTabs";
import AdminHeader from "@/components/Admin/Header/AdminHeader";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <AdminHeader />
      <main className="flex-1 p-6 md:p-10">
        <DashboardTabs />
      </main>
    </div>
  );
}
