import type { OrderItemWithDetails } from "@/types/order";

export function calculateSubtotal(
  price: number,
  quantity: number,
  itemUnitFactor: number,
  saleUnitFactor: number,
  discountPercent = 0
): number {
  const safeSaleUnitFactor = saleUnitFactor > 0 ? saleUnitFactor : 1;
  const safeItemUnitFactor = itemUnitFactor > 0 ? itemUnitFactor : safeSaleUnitFactor;
  const qtyInSaleUnit = (quantity * safeItemUnitFactor) / safeSaleUnitFactor;
  const discount = Math.min(100, Math.max(0, discountPercent));

  return (price * qtyInSaleUnit * (100 - discount)) / 100;
}

export function calculateItemSubtotal(item: OrderItemWithDetails): number {
  if (!item.product) return 0;

  const stockUnitFactor = item.product.stockUnit?.conversion_factor ?? 1;
  const saleUnitFactor =
    item.product.saleUnit?.conversion_factor ?? stockUnitFactor;
  const itemUnitFactor = item.unit?.conversion_factor ?? stockUnitFactor;

  return calculateSubtotal(
    item.product.price,
    item.quantity,
    itemUnitFactor,
    saleUnitFactor,
    item.discount_percent
  );
}