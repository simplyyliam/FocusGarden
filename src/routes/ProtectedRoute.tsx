import { useAuth } from "@/auth";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    if (isLoading) return;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!mounted) return;
        if (error || !data?.user) {
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } finally {
        if (mounted) setValidating(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isLoading]);

  if (isLoading || validating || isValid === null) return null;

  if (!user || isValid === false) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
