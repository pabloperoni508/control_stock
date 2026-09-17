import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/profile";

export const profilesService = {
  async getAll(): Promise<Profile[]> {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) throw error;
    return data ?? [];
  },
};