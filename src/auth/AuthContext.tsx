import { supabase } from "@/lib";
import { createContext, useEffect, useState } from "react";
import { type Session, type User } from "@supabase/supabase-js";

type Authentication = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

export const AuthContext = createContext<Authentication>({
  session: null,
  user: null,
  isLoading: true,
});

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
