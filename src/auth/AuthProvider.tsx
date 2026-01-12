import { supabase } from "@/lib";
import { useEffect, useState } from "react";
import { type Session, type User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContex";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    const { data: listiner } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listiner.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
