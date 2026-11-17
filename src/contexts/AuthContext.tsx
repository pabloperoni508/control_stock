import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { authService } from "@/services/authService";
import { organizationsService } from "@/services/organizationsService";
import { AuthContext, type AuthContextValue } from "@/contexts/AuthContextValue";
import type { ActiveOrganization } from "@/types/organization";

interface OrganizationState {
  userId: string | null;
  organization: ActiveOrganization | null;
  error: string | null;
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "No se pudo cargar la organización.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgState, setOrgState] = useState<OrganizationState>({
    userId: null,
    organization: null,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

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

  const user = session?.user ?? null;
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    organizationsService
      .getActiveForUser(userId)
      .then((organization) => {
        if (cancelled) return;
        setOrgState({ userId, organization, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setOrgState({ userId, organization: null, error: errorMessage(err) });
      });

    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  const retryOrganization = useCallback(() => {
    setOrgState({ userId: null, organization: null, error: null });
    setReloadKey((k) => k + 1);
  }, []);

  async function signIn(email: string, password: string) {
    await authService.signIn(email, password);
  }

  async function signOut() {
    await authService.signOut();
  }

  const orgMatchesUser = userId !== null && orgState.userId === userId;

  const value: AuthContextValue = {
    user,
    session,
    loading,
    organization: orgMatchesUser ? orgState.organization : null,
    organizationLoading: userId !== null && !orgMatchesUser,
    organizationError: orgMatchesUser ? orgState.error : null,
    retryOrganization,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}