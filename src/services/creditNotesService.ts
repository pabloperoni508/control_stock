import { supabase } from "@/lib/supabase";
import type { CreditNoteRecord } from "@/types/creditNote";

export const creditNotesService = {
  async getAll(): Promise<CreditNoteRecord[]> {
    const { data, error } = await supabase
      .from("credit_notes_view")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as CreditNoteRecord[];
  },
};