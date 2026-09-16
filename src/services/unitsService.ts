import { supabase } from "@/lib/supabase";
import type { Unit } from "@/types/product";

export const unitsService = {
  async getAll(): Promise<Unit[]> {
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },
};