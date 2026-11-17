import { supabase } from "@/lib/supabase";
import type { Expense } from "@/types/expense";
import type { PaymentMethod } from "@/types/cashRegister";

export const EXPENSES_PAGE_SIZE = 50;

export const expensesService = {
  /** Gastos de más reciente a más antiguo, por páginas (la API corta en 1000 filas). */
  async list(offset: number): Promise<Expense[]> {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + EXPENSES_PAGE_SIZE - 1);

    if (error) throw error;
    return data ?? [];
  },

  // No se envía tenant_id ni created_by: la base los completa y RLS valida.
  async create(input: {
    description: string;
    amount: number;
    paymentMethod: PaymentMethod;
    expenseDate: string;
  }): Promise<Expense> {
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        description: input.description,
        amount: input.amount,
        payment_method: input.paymentMethod,
        expense_date: input.expenseDate,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
