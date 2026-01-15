import type { Session, User } from "@supabase/supabase-js";

export type AuthProviderType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>  
};
