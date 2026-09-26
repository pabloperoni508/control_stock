import type { OrderItemWithDetails } from "@/types/order";

export function calculateItemSubtotal(
  item: OrderItemWithDetails,
  roundingRule: string,
  priceMode: "customer" | "business"
): number {
  const price =
    priceMode === "business"
      ? item.product?.business_price ?? item.product?.customer_price ?? 0
      : item.product?.customer_price ?? 0;

  const saleUnitFactor = item.product?.saleUnit?.conversion_factor ?? 1;
  const itemUnitFactor = item.unit?.conversion_factor ?? 1;
  const qtyInSaleUnit = (item.quantity * itemUnitFactor) / saleUnitFactor;

  let subtotal = price * qtyInSaleUnit;
  subtotal = (subtotal * (100 - item.discount_percent)) / 100;

  if (item.round_total) {
    if (roundingRule === "nearest_10") {
      subtotal = Math.round(subtotal / 10) * 10;
    } else if (roundingRule === "nearest_100") {
      subtotal = Math.round(subtotal / 100) * 100;
    }
  }

  return subtotal;
}