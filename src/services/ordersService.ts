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

  async getCompletedSince(from: Date): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "completed")
      .gte("completed_at", from.toISOString())
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
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