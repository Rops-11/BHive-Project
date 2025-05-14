// @/components/providers/AuthProvider.tsx
"use client";

import { AuthContextValue } from "@/types/context";
import {
  ReactNode,
  useState,
  createContext,
  useContext,
} from "react";

const FULLNAME_COOKIE_NAME = "staff_fullName";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [fullName, setFullNameState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return getCookie(FULLNAME_COOKIE_NAME);
    }
    return null;
  });

  const contextValue: AuthContextValue = {
    fullName,
    setFullNameState,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
