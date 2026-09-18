import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { authService } from "@/services/authService";
import { AuthContext, type AuthContextValue } from "@/contexts/AuthContextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Al montar, revisamos si ya hay una sesión guardada (persistencia)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 2. Nos suscribimos a cambios futuros de sesión (login/logout en cualquier parte de la app)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user) {
      authService.ensureProfile(session.user.id, session.user.email);
    }
  }, [session]);

  async function signIn(email: string, password: string) {
    await authService.signIn(email, password);
  }

  async function signOut() {
    await authService.signOut();
  }

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}