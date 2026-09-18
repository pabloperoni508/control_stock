import { useCallback, useEffect, useState } from "react";
import { ordersService } from "@/services/orderService";
import type { Order } from "@/types/order";

export function useOpenOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await ordersService.getOpen();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createOrder(customerName: string) {
    const order = await ordersService.create(customerName);
    await load();
    return order;
  }

  return { orders, loading, reload: load, createOrder };
}