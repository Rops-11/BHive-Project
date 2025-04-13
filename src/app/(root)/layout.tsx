import Footer from "@/components/footer";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}
  <Footer/></>;
}
