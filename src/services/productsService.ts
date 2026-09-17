import { supabase } from "@/lib/supabase";
import type { Product, ProductInsert, ProductUpdate } from "@/types/product";

export const productsService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(product: ProductInsert): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, changes: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .update(changes)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async setActive(id: string, active: boolean): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .update({ active })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};