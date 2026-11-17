import { supabase } from "@/lib/supabase";
import type { DailyTotal } from "@/types/bakeryAnalytics";

export const bakeryAnalyticsService = {
  /**
   * Ingresos y egresos por día entre dos instantes (from inclusive, to exclusivo).
   * La suma se hace en la base y respeta RLS, así que solo cuenta datos de la
   * organización del usuario. Los días se agrupan en la zona horaria del dispositivo.
   */
  async getDailyTotals(from: Date, to: Date): Promise<DailyTotal[]> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { data, error } = await supabase.rpc("bakery_period_totals", {
      p_from: from.toISOString(),
      p_to: to.toISOString(),
      p_timezone: timezone,
    });

    if (error) throw error;
    return (data ?? []) as DailyTotal[];
  },
};
