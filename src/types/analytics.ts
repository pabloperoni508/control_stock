export type PeriodOption = "week" | "month" | "year";

export interface SaleRecord {
  movement_id: string;
  product_id: string;
  product_name: string;
  price: number;
  category_id: string | null;
  quantity: number;
  created_at: string;
  user_id: string | null;
}

export interface PeriodSummary {
  total: number;
  previousTotal: number;
  changePercent: number | null;
  dailyTotals: { label: string; total: number }[];
}

export interface ProductRankingItem {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}