"use client";

import { AuthContextValue } from "@/types/context";
import { Session } from "@supabase/supabase-js";
import {
  ReactNode,
  useState,
  createContext,
  useEffect,
  useContext,
} from "react";
import { createClient } from "utils/supabase/client";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [session, setSession] = useState<Session | undefined | null>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const getInitialSession = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      setSession(initialSession);
      setIsLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log(
          "AuthProvider: onAuthStateChange event:",
          _event,
          "newSession:",
          newSession
        );
        setSession(newSession);

        if (
          _event === "SIGNED_IN" ||
          _event === "SIGNED_OUT" ||
          _event === "INITIAL_SESSION"
        ) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const contextValue: AuthContextValue = {
    session,
    setSession,
    supabase,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
