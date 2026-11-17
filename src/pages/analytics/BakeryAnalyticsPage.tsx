import { useEffect, useMemo, useState } from "react";
import { bakeryAnalyticsService } from "@/services/bakeryAnalyticsService";
import { getPeriodRange } from "@/utils/analytics";
import { summarizeFinance } from "@/utils/bakeryAnalytics";
import { formatAmount } from "@/utils/amount";
import { getErrorMessage } from "@/utils/errors";
import { MetricCard } from "@/components/analytics/MetricCard";
import { PeriodSelector } from "@/components/analytics/PeriodSelector";
import { IncomeExpenseChart } from "@/components/analytics/IncomeExpenseChart";
import { Button } from "@/components/ui/Button";
import { EXPENSE_COLOR, INCOME_COLOR, PERIOD_PHRASES } from "@/config/finance";
import type { PeriodOption } from "@/types/analytics";
import type { DailyTotal } from "@/types/bakeryAnalytics";

interface LoadResult {
  period: PeriodOption;
  reloadKey: number;
  from?: Date;
  current?: DailyTotal[];
  previous?: DailyTotal[];
  error?: string;
}

export function BakeryAnalyticsPage() {
  const [period, setPeriod] = useState<PeriodOption>("week");
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<LoadResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    const current = getPeriodRange(period, 0);
    const previous = getPeriodRange(period, -1);

    Promise.all([
      bakeryAnalyticsService.getDailyTotals(current.from, current.to),
      bakeryAnalyticsService.getDailyTotals(previous.from, previous.to),
    ])
      .then(([currentRows, previousRows]) => {
        if (cancelled) return;
        setResult({
          period,
          reloadKey,
          from: current.from,
          current: currentRows,
          previous: previousRows,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResult({
          period,
          reloadKey,
          error: getErrorMessage(err, "No se pudieron cargar las analíticas"),
        });
      });

    return () => {
      cancelled = true;
    };
  }, [period, reloadKey]);

  // Mientras el resultado guardado no corresponda al período elegido, se está cargando.
  const loading =
    result === null || result.period !== period || result.reloadKey !== reloadKey;

  const summary = useMemo(() => {
    if (!result || !result.from || !result.current || !result.previous) return null;
    return summarizeFinance(result.current, result.previous, result.period, result.from);
  }, [result]);

  const phrase = PERIOD_PHRASES[period];

  return (
    <div>
      <h1 style={{ margin: "0 0 1.5rem" }}>📊 Analíticas</h1>

      <PeriodSelector value={period} onChange={setPeriod} />

      {loading && <p>Cargando analíticas...</p>}

      {!loading && result?.error && (
        <div>
          <p style={{ color: "var(--color-danger)" }}>❌ {result.error}</p>
          <Button variant="secondary" onClick={() => setReloadKey((k) => k + 1)}>
            Reintentar
          </Button>
        </div>
      )}

      {!loading && summary && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <MetricCard
              label={`Ingresos ${phrase}`}
              value={summary.income}
              changePercent={summary.incomeChange}
              accentColor={INCOME_COLOR}
              formatValue={formatAmount}
            />
            <MetricCard
              label={`Egresos ${phrase}`}
              value={summary.expenses}
              changePercent={summary.expensesChange}
              accentColor={EXPENSE_COLOR}
              higherIsBetter={false}
              formatValue={formatAmount}
            />
            <MetricCard
              label={`Balance ${phrase}`}
              value={summary.balance}
              changePercent={summary.balanceChange}
              accentColor={
                summary.balance >= 0 ? "var(--color-success)" : "var(--color-danger)"
              }
              formatValue={formatAmount}
            />
          </div>

          <IncomeExpenseChart data={summary.buckets} showValues={period === "week"} />

          <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: 0 }}>
            El balance es el resultado de los movimientos registrados (ingresos menos
            egresos). No representa la ganancia contable real del negocio.
          </p>
        </div>
      )}
    </div>
  );
}
