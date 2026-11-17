import type { Database } from "@/types/database";

export type PaymentMethod = "cash" | "transfer" | "card" | "other";

export type CashRegisterPeriod =
  Database["public"]["Tables"]["cash_register_periods"]["Row"];
