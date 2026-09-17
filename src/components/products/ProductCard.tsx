import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatQuantity } from "@/utils/format";
import { isLowStock } from "@/utils/stock";
import type { ProductWithRelations } from "@/types/product";

interface ProductCardProps {
  product: ProductWithRelations;
  onOpenDetail: (product: ProductWithRelations) => void;
}

export function ProductCard({ product, onOpenDetail }: ProductCardProps) {
  const lowStock = isLowStock(product);
  const stockAbbr = product.stockUnit?.abbreviation ?? "";

  return (
    <div
      onClick={() => onOpenDetail(product)}
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        cursor: "pointer",
        opacity: product.active ? 1 : 0.6,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <strong style={{ fontSize: "1rem" }}>{product.name}</strong>
          {product.category && (
            <div
              style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}
            >
              {product.category.name}
            </div>
          )}
        </div>
        {!product.active && <Badge variant="neutral">Inactivo</Badge>}
      </div>

      <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>
        {formatCurrency(product.price)}
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            fontWeight: 400,
          }}
        >
          {" "}
          / {product.saleUnit?.abbreviation ?? ""}
        </span>
      </div>

      <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
        Stock: {formatQuantity(product.current_stock, stockAbbr)}
      </div>

      {lowStock && product.active && (
        <Badge variant="warning">⚠️ Queda poco producto</Badge>
      )}
    </div>
  );
}