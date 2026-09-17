import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Category, ProductWithRelations, Unit } from "@/types/product";

export interface ProductFormValues {
  name: string;
  description: string;
  category_id: string;
  stock_unit_id: string;
  sale_unit_id: string;
  price: number;
  min_stock: number;
}

interface ProductFormProps {
  initialProduct?: ProductWithRelations;
  categories: Category[];
  units: Unit[];
  submitting: boolean;
  error: string | null;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}

export function ProductForm({
  initialProduct,
  categories,
  units,
  submitting,
  error,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(
    initialProduct?.description ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    initialProduct?.category_id ?? ""
  );
  const [stockUnitId, setStockUnitId] = useState(
    initialProduct?.stock_unit_id ?? ""
  );
  const [saleUnitId, setSaleUnitId] = useState(
    initialProduct?.sale_unit_id ?? ""
  );
  const [price, setPrice] = useState(initialProduct?.price?.toString() ?? "0");
  const [minStock, setMinStock] = useState(
    initialProduct?.min_stock?.toString() ?? "0"
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category_id: categoryId,
      stock_unit_id: stockUnitId,
      sale_unit_id: saleUnitId,
      price: Number(price),
      min_stock: Number(minStock),
    });
  }

  const selectStyle = {
    width: "100%",
    padding: "0.6rem",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
    marginBottom: "1rem",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.3rem",
    fontSize: "0.85rem",
    color: "var(--color-text-muted)",
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nombre del producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        <label style={labelStyle}>Categoría</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          style={selectStyle}
        >
          <option value="" disabled>
            Seleccionar categoría
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Unidad de stock</label>
          <select
            value={stockUnitId}
            onChange={(e) => setStockUnitId(e.target.value)}
            required
            style={selectStyle}
          >
            <option value="" disabled>
              Seleccionar
            </option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.abbreviation})
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Unidad de venta</label>
          <select
            value={saleUnitId}
            onChange={(e) => setSaleUnitId(e.target.value)}
            required
            style={selectStyle}
          >
            <option value="" disabled>
              Seleccionar
            </option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.abbreviation})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Input
          label="Precio"
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <Input
          label="Stock mínimo"
          type="number"
          min={0}
          step="0.01"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
          required
          style={{ flex: 1 }}
        />
      </div>

      {error && (
        <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <Button type="submit" disabled={submitting} style={{ flex: 1 }}>
          {submitting
            ? "Guardando..."
            : initialProduct
            ? "Guardar cambios"
            : "Crear producto"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}