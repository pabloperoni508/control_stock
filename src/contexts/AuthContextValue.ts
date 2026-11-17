import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { ActiveOrganization } from "@/types/organization";

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  organization: ActiveOrganization | null;
  organizationLoading: boolean;
  organizationError: string | null;
  retryOrganization: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
