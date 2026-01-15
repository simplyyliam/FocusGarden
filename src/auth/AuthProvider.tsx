import { supabase } from "@/lib";
import { useEffect, useState } from "react";
import { type Session, type User } from "@supabase/supabase-js";
import { AuthContext } from "./AuthContex";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // initial session + server-side user verification
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session ?? null;

      if (!session) {
        if (!mounted) return;
        setSession(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { data: userData, error: userErr } = await supabase.auth.getUser();

      if (userErr || !userData?.user) {
        // server reports no user (deleted/invalid) — clear local session
        await supabase.auth.signOut();
        if (!mounted) return;
        setSession(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (!mounted) return;
      setSession(session);
      setUser(userData.user);
      setIsLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || event === "USER_DELETED") {
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
