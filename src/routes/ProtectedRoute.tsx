import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const {
    user,
    loading,
    organization,
    organizationLoading,
    organizationError,
    retryOrganization,
    signOut,
  } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (organizationLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Cargando...
      </div>
    );
  }

  if (!organization) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>
          {organizationError
            ? `No se pudo cargar tu organización: ${organizationError}`
            : "Tu usuario no pertenece a ninguna organización."}
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          {organizationError && (
            <button type="button" onClick={retryOrganization}>
              Reintentar
            </button>
          )}
          <button type="button" onClick={() => void signOut()}>
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}