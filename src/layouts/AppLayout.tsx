import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem",
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <strong>🥜 Control Stock</strong>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            {user?.email}
          </span>
          <button
            onClick={() => signOut()}
            style={{
              padding: "0.4rem 0.8rem",
              backgroundColor: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={{ padding: "1.5rem" }}>{children}</main>
    </div>
  );
}