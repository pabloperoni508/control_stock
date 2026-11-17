import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NAV_ITEMS } from "@/config/modules";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, organization } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navItems = organization ? NAV_ITEMS[organization.kind] : [];
  const brand =
    organization?.kind === "bakery"
      ? `🥖 ${organization.name}`
      : "🥜 Control Stock";

  return (
    <div className="app-shell">
      {drawerOpen && (
        <div
          className="app-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${drawerOpen ? "open" : ""}`}>
        <div className="app-sidebar-brand">{brand}</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
              onClick={() => setDrawerOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <button
            className="app-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginLeft: "auto",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
              {user?.email}
            </span>
          </div>
        </header>

        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}