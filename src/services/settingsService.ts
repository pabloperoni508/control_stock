import { supabase } from "@/lib/supabase";
import type { BusinessSettings, BusinessSettingsUpdate } from "@/types/settings";

export const settingsService = {
  async get(): Promise<BusinessSettings> {
    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, changes: BusinessSettingsUpdate): Promise<BusinessSettings> {
    const { data, error } = await supabase
      .from("business_settings")
      .update(changes)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};