import { supabase } from "@/lib/supabase";
import type { CashRegisterPeriod } from "@/types/cashRegister";

// Las cajas se crean, cierran y reabren solo mediante funciones de la base,
// que validan el rol y la regla de "una sola caja abierta por organización".
export const cashRegistersService = {
  /** Período abierto de la organización (RLS filtra por organización). */
  async getOpenPeriod(): Promise<CashRegisterPeriod | null> {
    const { data, error } = await supabase
      .from("cash_register_periods")
      .select("*")
      .is("closed_at", null)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /** Último período cerrado, para ofrecer la reapertura al administrador. */
  async getLastClosedPeriod(): Promise<CashRegisterPeriod | null> {
    const { data, error } = await supabase
      .from("cash_register_periods")
      .select("*")
      .not("closed_at", "is", null)
      .order("closed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async open(): Promise<string> {
    const { data, error } = await supabase.rpc("open_cash_register");
    if (error) throw error;
    return data as string;
  },

  async close(): Promise<string> {
    const { data, error } = await supabase.rpc("close_cash_register");
    if (error) throw error;
    return data as string;
  },

  async reopen(registerId: string): Promise<string> {
    const { data, error } = await supabase.rpc("reopen_cash_register", {
      p_register_id: registerId,
    });
    if (error) throw error;
    return data as string;
  },
};
