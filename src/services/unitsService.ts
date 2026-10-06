import { supabase } from "@/lib/supabase";
import type { Unit } from "@/types/product";

export interface UnitInsert {
  name: string;
  abbreviation: string;
  type: "weight" | "count" | "volume";
  conversion_factor: number;
}

export const unitsService = {
  async getAll(): Promise<Unit[]> {
    const { data, error } = await supabase
      .from("units")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(unit: UnitInsert): Promise<Unit> {
    const { data, error } = await supabase
      .from("units")
      .insert(unit)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, changes: Partial<UnitInsert>): Promise<Unit> {
    const { data, error } = await supabase
      .from("units")
      .update(changes)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("units").delete().eq("id", id);
    if (error) throw error;
  },
};