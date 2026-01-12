import type { AuthProviderType } from "@/types/auth/AuthProviderType";
import { createContext } from "react";

export const AuthContext = createContext<AuthProviderType>({
  session: null,
  user: null,
  isLoading: true,
});