import { supabase } from "@/lib/supabase";
import type { StockMovement, StockMovementInsert } from "@/types/movement";

export const movementsService = {
  async create(movement: StockMovementInsert): Promise<StockMovement> {
    const { data, error } = await supabase
      .from("stock_movements")
      .insert(movement)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getByProduct(productId: string): Promise<StockMovement[]> {
    const { data, error } = await supabase
      .from("stock_movements")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },
};