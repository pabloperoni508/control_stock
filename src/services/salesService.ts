import { supabase } from "@/lib/supabase";
import type { Order } from "@/types/order";
import type { PaymentMethod } from "@/types/cashRegister";

export const salesService = {
  /**
   * Ventas de una caja, de la más reciente a la más antigua.
   * Para mostrar la más antigua primero, cambiar ascending a true.
   */
  async listByRegister(registerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("cash_register_id", registerId)
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /** La función de la base asocia la venta a la caja abierta de la organización. */
  async register(
    description: string,
    amount: number,
    paymentMethod: PaymentMethod
  ): Promise<Order> {
    const { data, error } = await supabase.rpc("register_sale", {
      p_description: description,
      p_amount: amount,
      p_payment_method: paymentMethod,
    });

    if (error) throw error;
    return data as unknown as Order;
  },

  /** Solo se puede modificar una venta cuya caja sigue abierta (lo valida la base). */
  async update(
    orderId: string,
    description: string,
    amount: number,
    paymentMethod: PaymentMethod
  ): Promise<Order> {
    const { data, error } = await supabase.rpc("update_sale", {
      p_order_id: orderId,
      p_description: description,
      p_amount: amount,
      p_payment_method: paymentMethod,
    });

    if (error) throw error;
    return data as unknown as Order;
  },
};
