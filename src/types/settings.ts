import type { Database } from "@/types/database";

export type BusinessSettings = Database["public"]["Tables"]["business_settings"]["Row"];
export type BusinessSettingsUpdate = Database["public"]["Tables"]["business_settings"]["Update"];