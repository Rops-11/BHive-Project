"use client";

import { AuthContextValue } from "@/types/context";
import { ReactNode, useState, createContext, useContext } from "react";

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

function manageClientCookie(
  name: string,
  value: string | null,
  days: number = 7,
  path: string = "/"
) {
  if (typeof document === "undefined") {
    return;
  }
  let expires = "";
  let valueToEncode = "";

  if (value !== null) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
    valueToEncode = value;
  } else {
    const date = new Date();
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${encodeURIComponent(
    valueToEncode
  )}${expires}; path=${path}; SameSite=Lax`;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [fullName, setFullNameStateInternal] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return getCookie(FULLNAME_COOKIE_NAME);
    }
    return null;
  });

  const setFullNameState = (
    newFullName: string | null | ((prevState: string | null) => string | null)
  ) => {
    const valueToSet =
      typeof newFullName === "function" ? newFullName(fullName) : newFullName;

    setFullNameStateInternal(valueToSet);

    if (typeof window !== "undefined") {
      manageClientCookie(FULLNAME_COOKIE_NAME, valueToSet);
    }
  };

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
