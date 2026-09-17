import type { Product } from "@/types/product";

export function isLowStock(
  product: Pick<Product, "current_stock" | "min_stock">
): boolean {
  return product.current_stock <= product.min_stock;
}