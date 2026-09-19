import { supabase } from "@/lib/supabase";
import type { SaleRecord } from "@/types/analytics";

export const analyticsService = {
  async getSalesBetween(from: Date, to: Date): Promise<SaleRecord[]> {
    const { data, error } = await supabase
      .from("sales_view")
      .select("*")
      .gte("created_at", from.toISOString())
      .lt("created_at", to.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as SaleRecord[];
  },
};