import { useCallback, useEffect, useState } from "react";
import { productsService } from "@/services/productsService";
import { unitsService } from "@/services/unitsService";
import { categoriesService } from "@/services/categoriesService";
import type {
  Category,
  Product,
  ProductInsert,
  ProductUpdate,
  ProductWithRelations,
  Unit,
} from "@/types/product";

function mergeProduct(
  product: Product,
  categories: Category[],
  units: Unit[]
): ProductWithRelations {
  return {
    ...product,
    category: categories.find((c) => c.id === product.category_id) ?? null,
    stockUnit: units.find((u) => u.id === product.stock_unit_id) ?? null,
    saleUnit: units.find((u) => u.id === product.sale_unit_id) ?? null,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData, unitsData] = await Promise.all([
        productsService.getAll(),
        categoriesService.getAll(),
        unitsService.getAll(),
      ]);

      setProducts(
        productsData.map((p) => mergeProduct(p, categoriesData, unitsData))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar productos"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createProduct(product: ProductInsert) {
    await productsService.create(product);
    await load();
  }

  async function updateProduct(id: string, changes: ProductUpdate) {
    await productsService.update(id, changes);
    await load();
  }

  async function setActive(id: string, active: boolean) {
    await productsService.setActive(id, active);
    await load();
  }

  return {
    products,
    loading,
    error,
    reload: load,
    createProduct,
    updateProduct,
    setActive,
  };
}