import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { unitsService } from "@/services/unitsService";
import { categoriesService } from "@/services/categoriesService";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductSearchBar } from "@/components/products/ProductSearchBar";
import { ProductForm, type ProductFormValues } from "@/components/products/ProductForm";
import { ProductDetailModal } from "@/components/products/ProductDetailModal";
import { OpenOrdersWidget } from "@/components/orders/OpenOrdersWidget";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Category, ProductWithRelations, Unit } from "@/types/product";

export function ProductsPage() {
  const { products, loading, error, reload, createProduct, updateProduct, setActive } =
    useProducts();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithRelations | null>(null);

  useEffect(() => {
    Promise.all([categoriesService.getAll(), unitsService.getAll()]).then(
      ([categoriesData, unitsData]) => {
        setCategories(categoriesData);
        setUnits(unitsData);
      }
    );
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) => p.name.toLowerCase().includes(term));
  }, [products, search]);

  async function handleCreate(values: ProductFormValues) {
    setCreateSubmitting(true);
    setCreateError(null);
    try {
      await createProduct({
        name: values.name,
        description: values.description || null,
        category_id: values.category_id,
        stock_unit_id: values.stock_unit_id,
        sale_unit_id: values.sale_unit_id,
        customer_price: values.customer_price,
        business_price: values.business_price,
        min_stock: values.min_stock,
      });
      setCreating(false);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Error al crear producto"
      );
    } finally {
      setCreateSubmitting(false);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>📦 Productos</h1>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button onClick={() => navigate("/pedidos")}>🛒 Vender</Button>
          <Button variant="secondary" onClick={() => setCreating(true)}>
            + Nuevo producto
          </Button>
        </div>
      </div>

      <OpenOrdersWidget />

      <div style={{ marginBottom: "1.5rem" }}>
        <ProductSearchBar value={search} onChange={setSearch} />
      </div>

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "var(--color-danger)" }}>❌ {error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p style={{ color: "var(--color-text-muted)" }}>
          {search
            ? "No se encontraron productos con ese nombre."
            : "Todavía no hay productos cargados. Creá el primero con el botón de arriba."}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenDetail={setSelectedProduct}
          />
        ))}
      </div>

      {creating && (
        <Modal title="Nuevo producto" onClose={() => setCreating(false)}>
          <ProductForm
            categories={categories}
            units={units}
            submitting={createSubmitting}
            error={createError}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        </Modal>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={
            products.find((p) => p.id === selectedProduct.id) ?? selectedProduct
          }
          categories={categories}
          units={units}
          onClose={() => setSelectedProduct(null)}
          onUpdate={updateProduct}
          onToggleActive={setActive}
          onStockChanged={reload}
        />
      )}
    </div>
  );
}