import { useCallback, useEffect, useState } from "react";
import { ordersService } from "@/services/orderService";
import { productsService } from "@/services/productsService";
import { unitsService } from "@/services/unitsService";
import { categoriesService } from "@/services/categoriesService";
import type { Order, OrderItemInsert, OrderItemWithDetails } from "@/types/order";
import type { ProductWithRelations } from "@/types/product";

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderData, itemsData, productsData, categoriesData, unitsData] =
        await Promise.all([
          ordersService.getById(orderId),
          ordersService.getItems(orderId),
          productsService.getAll(),
          categoriesService.getAll(),
          unitsService.getAll(),
        ]);

      const productsWithRelations: ProductWithRelations[] = productsData.map((p) => ({
        ...p,
        category: categoriesData.find((c) => c.id === p.category_id) ?? null,
        stockUnit: unitsData.find((u) => u.id === p.stock_unit_id) ?? null,
        saleUnit: unitsData.find((u) => u.id === p.sale_unit_id) ?? null,
      }));

      setOrder(orderData);
      setItems(
        itemsData.map((item) => ({
          ...item,
          product: productsWithRelations.find((p) => p.id === item.product_id) ?? null,
          unit: unitsData.find((u) => u.id === item.unit_id) ?? null,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el pedido");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function addItem(item: Omit<OrderItemInsert, "order_id">) {
    await ordersService.addItem({ ...item, order_id: orderId });
    await load();
  }

  async function updateItemQuantity(itemId: string, quantity: number, unitId: string) {
    await ordersService.updateItem(itemId, { quantity, unit_id: unitId });
    await load();
  }

  async function togglePrepared(itemId: string, prepared: boolean) {
    await ordersService.updateItem(itemId, { prepared });
    await load();
  }

  async function removeItem(itemId: string) {
    await ordersService.removeItem(itemId);
    await load();
  }

  return {
    order,
    items,
    loading,
    error,
    reload: load,
    addItem,
    updateItemQuantity,
    togglePrepared,
    removeItem,
  };
}