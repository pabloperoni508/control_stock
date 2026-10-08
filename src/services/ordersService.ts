import { supabase } from "@/lib/supabase";
import type { Order, OrderItem, OrderItemInsert, OrderItemUpdate } from "@/types/order";

export const ordersService = {
  async getOpen(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(customerName: string): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .insert({ customer_name: customerName || null })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw error;
  },

  async closeOrder(orderId: string): Promise<Order> {
    const { data, error } = await supabase.rpc("close_order", {
      p_order_id: orderId,
    });

    if (error) throw error;
    return data as Order;
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const { data, error } = await supabase.rpc("cancel_order", {
      p_order_id: orderId,
    });

    if (error) throw error;
    return data as Order;
  },

  async updatePriceMode(orderId: string, priceMode: "customer" | "business"): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .update({ price_mode: priceMode })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateOwes(orderId: string, owes: boolean): Promise<Order> {
    const { data, error } = await supabase
      .from("orders")
      .update({ owes })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOwed(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "completed")
      .eq("owes", true)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getAllCompleted(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "completed")
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getCompletedToday(): Promise<Order[]> {
    const from = new Date();
    from.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "completed")
      .gte("completed_at", from.toISOString())
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getItemsSummary(orderId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("order_items")
      .select("quantity, product:products(name), unit:units(abbreviation)")
      .eq("order_id", orderId);

    if (error) throw error;

    return (data ?? []).map((row) => {
      const r = row as unknown as {
        quantity: number;
        product: { name: string } | null;
        unit: { abbreviation: string } | null;
      };
      return `${r.quantity} ${r.unit?.abbreviation ?? ""} ${r.product?.name ?? "Producto"}`.trim();
    });
  },

  async getItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async addItem(item: OrderItemInsert): Promise<OrderItem> {
    const { data, error } = await supabase
      .from("order_items")
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateItem(id: string, changes: OrderItemUpdate): Promise<OrderItem> {
    const { data, error } = await supabase
      .from("order_items")
      .update(changes)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeItem(id: string): Promise<void> {
    const { error } = await supabase.from("order_items").delete().eq("id", id);
    if (error) throw error;
  },
};