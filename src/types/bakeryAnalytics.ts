export interface DailyTotal {
  day: string; // "AAAA-MM-DD"
  income: number;
  expenses: number;
}

export interface FinanceBucket {
  label: string;
  income: number;
  expenses: number;
}

export interface FinanceSummary {
  income: number;
  expenses: number;
  balance: number;
  incomeChange: number | null;
  expensesChange: number | null;
  balanceChange: number | null;
  buckets: FinanceBucket[];
}
