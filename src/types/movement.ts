import type { Database } from "@/types/database";

export type StockMovement = Database["public"]["Tables"]["stock_movements"]["Row"];
export type StockMovementInsert = Database["public"]["Tables"]["stock_movements"]["Insert"];
export type MovementType = StockMovement["type"];

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  ingreso: "Ingreso",
  venta: "Venta",
  merma: "perdida",
  ajuste: "Ajuste",
  devolucion: "Devolución",
};