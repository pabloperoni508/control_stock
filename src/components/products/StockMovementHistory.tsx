import { useEffect, useState } from "react";
import { movementsService } from "@/services/movementsService";
import { profilesService } from "@/services/profilesService";
import { Badge } from "@/components/ui/Badge";
import { formatQuantity } from "@/utils/format";
import { MOVEMENT_TYPE_LABELS, type StockMovement } from "@/types/movement";
import type { Profile } from "@/types/profile";

interface StockMovementHistoryProps {
  productId: string;
  stockUnitAbbr: string;
  refreshKey: number;
}

const badgeVariant: Record<StockMovement["type"], "success" | "warning" | "danger" | "neutral"> = {
  ingreso: "success",
  devolucion: "success",
  venta: "neutral",
  merma: "danger",
  ajuste: "warning",
};

export function StockMovementHistory({
  productId,
  stockUnitAbbr,
  refreshKey,
}: StockMovementHistoryProps) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      movementsService.getByProduct(productId),
      profilesService.getAll(),
    ])
      .then(([movementsData, profilesData]) => {
        setMovements(movementsData);
        setProfiles(profilesData);
      })
      .finally(() => setLoading(false));
  }, [productId, refreshKey]);

  if (loading) return <p style={{ fontSize: "0.85rem" }}>Cargando historial...</p>;

  if (movements.length === 0) {
    return (
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
        Todavía no hay movimientos registrados para este producto.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {movements.map((m) => {
        const profile = profiles.find((p) => p.id === m.user_id);
        const delta = m.new_stock - m.previous_stock;
        const sign = delta > 0 ? "+" : "";

        return (
          <div
            key={m.id}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "0.6rem 0.8rem",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Badge variant={badgeVariant[m.type]}>{MOVEMENT_TYPE_LABELS[m.type]}</Badge>
              <span style={{ fontWeight: 600 }}>
                {sign}
                {formatQuantity(delta, stockUnitAbbr)}
              </span>
            </div>
            <div style={{ color: "var(--color-text-muted)", marginTop: "0.3rem" }}>
              {formatQuantity(m.previous_stock, stockUnitAbbr)} → {formatQuantity(m.new_stock, stockUnitAbbr)}
            </div>
            {m.reason && <div style={{ marginTop: "0.2rem" }}>{m.reason}</div>}
            <div style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", marginTop: "0.3rem" }}>
              {new Date(m.created_at).toLocaleString("es-AR")}
              {profile?.email ? ` · ${profile.email}` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}