import type { SaleRecord, PeriodOption, PeriodSummary, ProductRankingItem } from "@/types/analytics";

export function getPeriodRange(period: PeriodOption, offset: number) {
  const now = new Date();
  let from: Date;
  let to: Date;

  if (period === "week") {
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day; // semana empieza en lunes
    from = new Date(now);
    from.setDate(now.getDate() + mondayOffset + offset * 7);
    from.setHours(0, 0, 0, 0);
    to = new Date(from);
    to.setDate(from.getDate() + 7);
  } else if (period === "month") {
    from = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    to = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1);
  } else {
    from = new Date(now.getFullYear() + offset, 0, 1);
    to = new Date(now.getFullYear() + offset + 1, 0, 1);
  }

  return { from, to };
}

export function summarizeSales(
  current: SaleRecord[],
  previous: SaleRecord[],
  period: PeriodOption,
  from: Date
): PeriodSummary {
  const total = current.reduce((sum, s) => sum + s.price * s.quantity, 0);
  const previousTotal = previous.reduce((sum, s) => sum + s.price * s.quantity, 0);

  const changePercent =
    previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : null;

  const dailyTotals = buildDailyTotals(current, period, from);

  return { total, previousTotal, changePercent, dailyTotals };
}

function buildDailyTotals(
  sales: SaleRecord[],
  period: PeriodOption,
  from: Date
): { label: string; total: number }[] {
  if (period === "week") {
    const labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const totals = new Array(7).fill(0);
    for (const s of sales) {
      const diffDays = Math.floor(
        (new Date(s.created_at).getTime() - from.getTime()) / 86400000
      );
      if (diffDays >= 0 && diffDays < 7) totals[diffDays] += s.price * s.quantity;
    }
    return labels.map((label, i) => ({ label, total: totals[i] }));
  }

  if (period === "month") {
    const daysInMonth = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate();
    const totals = new Array(daysInMonth).fill(0);
    for (const s of sales) {
      const d = new Date(s.created_at).getDate() - 1;
      if (d >= 0 && d < daysInMonth) totals[d] += s.price * s.quantity;
    }
    return totals.map((total, i) => ({ label: String(i + 1), total }));
  }

  // year: por mes
  const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const totals = new Array(12).fill(0);
  for (const s of sales) {
    const m = new Date(s.created_at).getMonth();
    totals[m] += s.price * s.quantity;
  }
  return labels.map((label, i) => ({ label, total: totals[i] }));
}

export function buildProductRanking(sales: SaleRecord[]): ProductRankingItem[] {
  const map = new Map<string, ProductRankingItem>();

  for (const s of sales) {
    const existing = map.get(s.product_id);
    if (existing) {
      existing.totalQuantity += s.quantity;
      existing.totalRevenue += s.price * s.quantity;
    } else {
      map.set(s.product_id, {
        productId: s.product_id,
        productName: s.product_name,
        totalQuantity: s.quantity,
        totalRevenue: s.price * s.quantity,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
}