import type { Database } from "@/types/database";
import type { ProductWithRelations } from "@/types/product";
import type { Unit } from "@/types/product";

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"];
export type OrderItemUpdate = Database["public"]["Tables"]["order_items"]["Update"];

export interface OrderItemWithDetails extends OrderItem {
  product: ProductWithRelations | null;
  unit: Unit | null;
}