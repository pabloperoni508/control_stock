import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductForm, type ProductFormValues } from "@/components/products/ProductForm";
import { StockMovementForm } from "@/components/products/StockMovementForm";
import { StockMovementHistory } from "@/components/products/StockMovementHistory";
import { movementsService } from "@/services/movementsService";
import { formatCurrency, formatQuantity } from "@/utils/format";
import { isLowStock } from "@/utils/stock";
import type { MovementType } from "@/types/movement";
import type { Category, ProductUpdate, ProductWithRelations, Unit } from "@/types/product";

interface ProductDetailModalProps {
  product: ProductWithRelations;
  categories: Category[];
  units: Unit[];
  onClose: () => void;
  onUpdate: (id: string, changes: ProductUpdate) => Promise<void>;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  onStockChanged: () => Promise<void>;
}

type Mode = "view" | "edit" | "movement";

export function ProductDetailModal({
  product,
  categories,
  units,
  onClose,
  onUpdate,
  onToggleActive,
  onStockChanged,
}: ProductDetailModalProps) {
  const [mode, setMode] = useState<Mode>("view");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyKey, setHistoryKey] = useState(0);

  const lowStock = isLowStock(product);
  const stockAbbr = product.stockUnit?.abbreviation ?? "";

  async function handleSubmit(values: ProductFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await onUpdate(product.id, {
        name: values.name,
        description: values.description || null,
        category_id: values.category_id,
        stock_unit_id: values.stock_unit_id,
        sale_unit_id: values.sale_unit_id,
        customer_price: values.customer_price,
        business_price: values.business_price,
        min_stock: values.min_stock,
      });
      setMode("view");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar cambios");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive() {
    setSubmitting(true);
    try {
      await onToggleActive(product.id, !product.active);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMovementSubmit(values: {
    type: MovementType;
    quantity: number;
    reason: string;
  }) {
    setSubmitting(true);
    setError(null);
    try {
      await movementsService.create({
        product_id: product.id,
        type: values.type,
        quantity: values.quantity,
        reason: values.reason || null,
      });
      await onStockChanged();
      setHistoryKey((k) => k + 1);
      setMode("view");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar el movimiento");
    } finally {
      setSubmitting(false);
    }
  }

  if (mode === "edit") {
    return (
      <Modal title={`Editar: ${product.name}`} onClose={onClose}>
        <ProductForm
          initialProduct={product}
          categories={categories}
          units={units}
          submitting={submitting}
          error={error}
          onSubmit={handleSubmit}
          onCancel={() => setMode("view")}
        />
      </Modal>
    );
  }

  if (mode === "movement") {
    return (
      <Modal title={`Movimiento de stock: ${product.name}`} onClose={onClose}>
        <StockMovementForm
          stockUnitAbbr={stockAbbr}
          submitting={submitting}
          error={error}
          onSubmit={handleMovementSubmit}
          onCancel={() => setMode("view")}
        />
      </Modal>
    );
  }

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid var(--color-border)",
  };

  return (
    <Modal title={product.name} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.3rem" }}>
          {!product.active && <Badge variant="neutral">Inactivo</Badge>}
          {lowStock && product.active && (
            <Badge variant="warning">⚠️ Queda poco producto</Badge>
          )}
        </div>

        {product.description && (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            {product.description}
          </p>
        )}

        <div style={rowStyle}>
          <span style={{ color: "var(--color-text-muted)" }}>Categoría</span>
          <strong>{product.category?.name ?? "-"}</strong>
        </div>

        <div style={rowStyle}>
          <span style={{ color: "var(--color-text-muted)" }}>Precio consumidor final</span>
          <strong>{formatCurrency(product.customer_price)}</strong>
        </div>

        <div style={rowStyle}>
          <span style={{ color: "var(--color-text-muted)" }}>Precio negocio</span>
          <strong>
            {product.business_price !== null
              ? formatCurrency(product.business_price)
              : "Sin configurar"}
          </strong>
        </div>

        <div style={rowStyle}>
          <span style={{ color: "var(--color-text-muted)" }}>Stock actual</span>
          <strong>{formatQuantity(product.current_stock, stockAbbr)}</strong>
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <span style={{ color: "var(--color-text-muted)" }}>Stock mínimo</span>
          <strong>{formatQuantity(product.min_stock, stockAbbr)}</strong>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          <Button onClick={() => setMode("edit")}>Editar</Button>
          <Button onClick={() => setMode("movement")}>📦 Gestionar stock</Button>
          <Button
            variant={product.active ? "danger" : "secondary"}
            onClick={handleToggleActive}
            disabled={submitting}
          >
            {product.active ? "Desactivar" : "Reactivar"}
          </Button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <h3 style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>Historial de movimientos</h3>
          <StockMovementHistory
            productId={product.id}
            stockUnitAbbr={stockAbbr}
            refreshKey={historyKey}
          />
        </div>
      </div>
    </Modal>
  );
}