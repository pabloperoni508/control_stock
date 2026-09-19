import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { formatQuantity } from "@/utils/format";
import { isLowStock } from "@/utils/stock";
import type { ProductWithRelations } from "@/types/product";

interface StockAlertsProps {
  products: ProductWithRelations[];
  lowRotationDays: number;
  lastMovementByProduct: Map<string, string>; // product_id -> fecha ISO del último movimiento
}

export function StockAlerts({ products, lowRotationDays, lastMovementByProduct }: StockAlertsProps) {
  const navigate = useNavigate();

  // Date.now() se calcula en un efecto (después del render), no directamente
  // en el cuerpo del componente, para no violar la regla de "render puro".
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);

  const lowStockProducts = products.filter((p) => p.active && isLowStock(p));

  const lowRotationProducts =
    now === null
      ? []
      : products.filter((p) => {
          if (!p.active || p.current_stock <= 0) return false;
          const lastMovement = lastMovementByProduct.get(p.id);
          if (!lastMovement) return true; // nunca tuvo movimiento: se considera baja rotación
          const daysSince = (now - new Date(lastMovement).getTime()) / 86400000;
          return daysSince >= lowRotationDays;
        });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h3 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>
          ⚠️ Productos con poco stock
        </h3>
        {lowStockProducts.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Ningún producto está por debajo de su stock mínimo.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate("/productos")}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0.7rem",
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <span>{p.name}</span>
                <Badge variant="warning">
                  {formatQuantity(p.current_stock, p.stockUnit?.abbreviation ?? "")}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>
          🐌 Baja rotación (sin movimiento hace {lowRotationDays}+ días)
        </h3>
        {lowRotationProducts.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            No hay productos con baja rotación.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {lowRotationProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate("/productos")}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0.7rem",
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <span>{p.name}</span>
                <Badge variant="neutral">
                  {formatQuantity(p.current_stock, p.stockUnit?.abbreviation ?? "")}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}