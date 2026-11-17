import type { PeriodOption } from "@/types/analytics";
import type {
  DailyTotal,
  FinanceBucket,
  FinanceSummary,
} from "@/types/bakeryAnalytics";

const WEEK_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const YEAR_LABELS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function sumBy(rows: DailyTotal[], key: "income" | "expenses"): number {
  return round2(rows.reduce((total, row) => total + row[key], 0));
}

/** Variación porcentual contra el período anterior; null si no hay base de comparación. */
export function changePercent(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

// Los días llegan como "AAAA-MM-DD" ya en la zona horaria del usuario:
// se leen como texto para no sufrir corrimientos por huso horario.
function parseDay(day: string): { year: number; month: number; date: number } {
  const [year, month, date] = day.split("-").map(Number);
  return { year, month, date };
}

/**
 * Reparte los totales diarios en las mismas barras que las analíticas de stock:
 * semana = 7 días (lun a dom), mes = 4 semanas (1-7, 8-14, 15-21, 22-fin),
 * año = 12 meses.
 */
export function buildBuckets(
  rows: DailyTotal[],
  period: PeriodOption,
  from: Date
): FinanceBucket[] {
  let labels: string[];
  let indexOf: (day: string) => number;

  if (period === "week") {
    labels = WEEK_LABELS;
    const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    indexOf = (day) => {
      const { year, month, date } = parseDay(day);
      return Math.round((Date.UTC(year, month - 1, date) - fromUtc) / 86400000);
    };
  } else if (period === "month") {
    labels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
    indexOf = (day) => Math.min(Math.floor((parseDay(day).date - 1) / 7), 3);
  } else {
    labels = YEAR_LABELS;
    indexOf = (day) => parseDay(day).month - 1;
  }

  const buckets: FinanceBucket[] = labels.map((label) => ({
    label,
    income: 0,
    expenses: 0,
  }));

  for (const row of rows) {
    const index = indexOf(row.day);
    if (index >= 0 && index < buckets.length) {
      buckets[index].income += row.income;
      buckets[index].expenses += row.expenses;
    }
  }

  return buckets.map((b) => ({
    label: b.label,
    income: round2(b.income),
    expenses: round2(b.expenses),
  }));
}

export function summarizeFinance(
  current: DailyTotal[],
  previous: DailyTotal[],
  period: PeriodOption,
  from: Date
): FinanceSummary {
  const income = sumBy(current, "income");
  const expenses = sumBy(current, "expenses");
  const balance = round2(income - expenses);

  const previousIncome = sumBy(previous, "income");
  const previousExpenses = sumBy(previous, "expenses");
  const previousBalance = round2(previousIncome - previousExpenses);

  return {
    income,
    expenses,
    balance,
    incomeChange: changePercent(income, previousIncome),
    expensesChange: changePercent(expenses, previousExpenses),
    balanceChange: changePercent(balance, previousBalance),
    buckets: buildBuckets(current, period, from),
  };
}
