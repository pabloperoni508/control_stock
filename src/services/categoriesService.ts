import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/product";

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },
};