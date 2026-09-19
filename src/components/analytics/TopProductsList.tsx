import { formatCurrency } from "@/utils/format";
import type { ProductRankingItem } from "@/types/analytics";

interface TopProductsListProps {
  ranking: ProductRankingItem[];
  limit?: number;
}

export function TopProductsList({ ranking, limit = 5 }: TopProductsListProps) {
  const top = ranking.slice(0, limit);

  if (top.length === 0) {
    return (
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
        Sin ventas en este período.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {top.map((item, i) => (
        <div
          key={item.productId}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.6rem 0.8rem",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontWeight: 700, color: "var(--color-text-muted)" }}>#{i + 1}</span>
            <span>{item.productName}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 600 }}>{formatCurrency(item.totalRevenue)}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              {item.totalQuantity} vendidas
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}