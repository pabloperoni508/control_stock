import type { PeriodOption } from "@/types/analytics";

// Colores con significado fijo: no cambian con el tema de la organización.
export const INCOME_COLOR = "#2b6cb0";
export const EXPENSE_COLOR = "var(--color-danger)";

export const PERIOD_LABELS: Record<PeriodOption, string> = {
  week: "Semana",
  month: "Mes",
  year: "Año",
};

export const PERIOD_PHRASES: Record<PeriodOption, string> = {
  week: "esta semana",
  month: "este mes",
  year: "este año",
};
