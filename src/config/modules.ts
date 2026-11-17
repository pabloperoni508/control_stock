import type { OrgKind } from "@/types/organization";

export interface NavItem {
  to: string;
  label: string;
}

export const NAV_ITEMS: Record<OrgKind, NavItem[]> = {
  stock: [
    { to: "/productos", label: "📦 Productos" },
    { to: "/pedidos/historial", label: "📋 Historial de pedidos" },
    { to: "/analiticas", label: "📊 Analíticas" },
    { to: "/negocio", label: "🏪 Gestión del negocio" },
    { to: "/configuracion", label: "⚙️ Configuración" },
  ],
  bakery: [
    { to: "/ventas", label: "💵 Ventas" },
    { to: "/administracion", label: "🧾 Administración" },
    { to: "/analiticas", label: "📊 Analíticas" },
    { to: "/negocio", label: "🏪 Gestión del negocio" },
    { to: "/configuracion", label: "⚙️ Configuración" },
  ],
};

export const HOME_PATH: Record<OrgKind, string> = {
  stock: "/productos",
  bakery: "/ventas",
};

export function getOrgKind(modules: string[]): OrgKind | null {
  if (modules.includes("bakery")) return "bakery";
  if (modules.includes("stock")) return "stock";
  return null;
}
