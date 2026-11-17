import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { HOME_PATH } from "@/config/modules";
import type { OrgKind } from "@/types/organization";

export function ModuleRoute({
  kind,
  children,
}: {
  kind: OrgKind;
  children: ReactNode;
}) {
  const { organization } = useAuth();

  if (!organization) return null;
  if (organization.kind !== kind) {
    return <Navigate to={HOME_PATH[organization.kind]} replace />;
  }
  return <>{children}</>;
}

export function ModuleView({ views }: { views: Record<OrgKind, ReactNode> }) {
  const { organization } = useAuth();

  if (!organization) return null;
  return <>{views[organization.kind]}</>;
}

export function HomeRedirect() {
  const { organization } = useAuth();

  if (!organization) return null;
  return <Navigate to={HOME_PATH[organization.kind]} replace />;
}
