export interface CreditNoteRecord {
  id: string;
  order_id: string;
  user_id: string | null;
  total: number | null;
  created_at: string;
  customer_name: string | null;
}