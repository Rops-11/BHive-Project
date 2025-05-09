"use client";

import { AuthContextValue } from "@/types/context";
import { User, Session, SupabaseClient } from "@supabase/supabase-js";
import {
  ReactNode,
  useState,
  createContext,
  useEffect,
  useContext,
} from "react";
import { toast } from "react-toastify";
import { createClient } from "utils/supabase/client";
import Loading from "../ui/Loading";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    setIsLoading(true); // Keep loading if supabase is not ready

    const getInitialSession = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching initial session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        console.log("Auth event:", event, session); // For debugging
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const contextValue: AuthContextValue = {
    user,
    setUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoading ? <Loading loading={isLoading} /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
