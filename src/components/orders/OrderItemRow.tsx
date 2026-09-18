import { formatQuantity } from "@/utils/format";
import type { OrderItemWithDetails } from "@/types/order";

interface OrderItemRowProps {
  item: OrderItemWithDetails;
  readOnly?: boolean;
  onTogglePrepared: (prepared: boolean) => void;
  onRemove: () => void;
}

export function OrderItemRow({
  item,
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
      </div>

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