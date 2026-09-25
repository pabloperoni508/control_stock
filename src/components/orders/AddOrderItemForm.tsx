import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ProductWithRelations, Unit } from "@/types/product";
import { calculateSubtotal } from "@/utils/pricing";
import { formatCurrency } from "@/utils/format";

interface AddOrderItemFormProps {
  products: ProductWithRelations[];
  units: Unit[];
  submitting: boolean;
  onAdd: (values: {
    product_id: string;
    quantity: number;
    unit_id: string;
    discount_percent: number;
  }) => void;
}

export function AddOrderItemForm({ products, units, submitting, onAdd }: AddOrderItemFormProps) {
  const activeProducts = useMemo(() => products.filter((p) => p.active), [products]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitId, setUnitId] = useState("");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [discountEnabled, setDiscountEnabled] = useState(false);

  const selectedProduct = activeProducts.find((p) => p.id === productId);
  const selectedUnit = units.find((unit) => unit.id === unitId);
  const quantityValue = Number(quantity);
  const effectiveDiscount = discountEnabled ? Number(discountPercent) || 0 : 0;
  const subtotal = selectedProduct && selectedUnit && quantityValue > 0
    ? calculateSubtotal(
        selectedProduct.price,
        quantityValue,
        selectedUnit.conversion_factor,
        selectedProduct.saleUnit?.conversion_factor ?? selectedProduct.stockUnit?.conversion_factor ?? 1,
        effectiveDiscount
      )
    : null;

  const compatibleUnits = useMemo(() => {
    if (!selectedProduct?.stockUnit) return [];
    return units.filter((u) => u.type === selectedProduct.stockUnit!.type);
  }, [selectedProduct, units]);

  function handleProductChange(id: string) {
    setProductId(id);
    const product = activeProducts.find((p) => p.id === id);
    setUnitId(product?.stock_unit_id ?? "");
  }

  function handleSubmit() {
    if (!productId || !unitId || !quantity) return;
    onAdd({
      product_id: productId,
      quantity: Number(quantity),
      unit_id: unitId,
      discount_percent: effectiveDiscount,
    });
    setProductId("");
    setQuantity("");
    setUnitId("");
    setDiscountPercent("0");
    setDiscountEnabled(false);
  }

  const selectStyle = {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-end",
        flexWrap: "wrap",
        padding: "1rem",
        backgroundColor: "var(--color-bg)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ flex: "1 1 200px" }}>
        <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
          Producto
        </label>
        <select
          value={productId}
          onChange={(e) => handleProductChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">Seleccionar...</option>
          {activeProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100px" }}>
        <Input
          label="Cantidad"
          type="number"
          min={0.01}
          step="0.01"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ marginBottom: 0 }}
        />
      </div>

      <div style={{ width: "120px" }}>
        <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
          Unidad
        </label>
        <select
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
          disabled={!productId}
          style={selectStyle}
        >
          {compatibleUnits.map((u) => (
            <option key={u.id} value={u.id}>
              {u.abbreviation}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100px" }}>
        <Input
          label="Descuento %"
          type="number"
          min={0}
          max={100}
          step="1"
          value={discountPercent}
          onChange={(e) => setDiscountPercent(e.target.value)}
          disabled={!discountEnabled}
          style={{ marginBottom: 0 }}
        />
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.85rem",
          paddingBottom: "0.6rem",
        }}
      >
        <input
          type="checkbox"
          checked={discountEnabled}
          onChange={(e) => setDiscountEnabled(e.target.checked)}
          style={{ width: "18px", height: "18px" }}
        />
        Habilitar descuento
      </label>

      {subtotal !== null && (
        <strong style={{ paddingBottom: "0.6rem", whiteSpace: "nowrap" }}>
          Importe: {formatCurrency(subtotal)}
        </strong>
      )}

      <Button
        onClick={handleSubmit}
        disabled={submitting || !productId || !quantity}
      >
        + Agregar
      </Button>
    </div>
  );
}