import { formatCurrency, formatQuantity } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";
import type { OrderItemWithDetails } from "@/types/order";

interface OrderItemRowProps {
  item: OrderItemWithDetails;
  subtotal?: number;
  readOnly?: boolean;
  onTogglePrepared: (prepared: boolean) => void;
  onRemove: () => void;
}

export function OrderItemRow({
  item,
  subtotal,
  readOnly = false,
  onTogglePrepared,
  onRemove,
}: OrderItemRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        opacity: item.prepared ? 0.6 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={item.prepared}
        disabled={readOnly}
        onChange={(e) => onTogglePrepared(e.target.checked)}
        style={{ width: "20px", height: "20px" }}
      />

      <div style={{ flex: 1 }}>
        <strong
          style={{ textDecoration: item.prepared ? "line-through" : "none" }}
        >
          {item.product?.name ?? "Producto eliminado"}
        </strong>
        <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          {formatQuantity(item.quantity, item.unit?.abbreviation ?? "")}
        </div>
        {(item.discount_percent > 0 || item.round_total) && (
          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem" }}>
            {item.discount_percent > 0 && (
              <Badge variant="success">-{item.discount_percent}%</Badge>
            )}
            {item.round_total && <Badge variant="neutral">Redondeado</Badge>}
          </div>
        )}
      </div>

      {subtotal !== undefined && (
        <div style={{ fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
          {formatCurrency(subtotal)}
        </div>
      )}

      {!readOnly && (
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-danger)",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
          aria-label="Quitar"
        >
          ×
        </button>
      )}
    </div>
  );
}