import Header from "@/components/LandingPage/Header";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <Header />
      {children}
    </div>
  );
}
