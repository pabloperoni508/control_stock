import { EXPENSE_COLOR, INCOME_COLOR } from "@/config/finance";
import { formatAmount } from "@/utils/amount";
import type { FinanceBucket } from "@/types/bakeryAnalytics";

interface IncomeExpenseChartProps {
  data: FinanceBucket[];
  showValues?: boolean;
}

const BAR_AREA_HEIGHT = 110;

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "2px",
          backgroundColor: color,
        }}
      />
      {label}
    </span>
  );
}

export function IncomeExpenseChart({ data, showValues = false }: IncomeExpenseChartProps) {
  const max = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1);
  const barHeight = (value: number) => `${(value / max) * 100}%`;

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          fontSize: "0.8rem",
          color: "var(--color-text-muted)",
          marginBottom: "0.75rem",
        }}
      >
        <Legend color={INCOME_COLOR} label="Ingresos" />
        <Legend color={EXPENSE_COLOR} label="Egresos" />
      </div>

      <div style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
        {data.map((d) => (
          <div
            key={d.label}
            title={`${d.label}: ingresos ${formatAmount(d.income)} · egresos ${formatAmount(d.expenses)}`}
            style={{
              flex: 1,
              minWidth: "44px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "2px",
                width: "100%",
                height: `${BAR_AREA_HEIGHT}px`,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: barHeight(d.income),
                  minHeight: d.income > 0 ? "3px" : "0",
                  backgroundColor: INCOME_COLOR,
                  borderRadius: "3px 3px 0 0",
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: barHeight(d.expenses),
                  minHeight: d.expenses > 0 ? "3px" : "0",
                  backgroundColor: EXPENSE_COLOR,
                  borderRadius: "3px 3px 0 0",
                }}
              />
            </div>

            <div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              {d.label}
            </div>

            {showValues && (
              <>
                <div style={{ fontSize: "0.65rem", fontWeight: 600, color: INCOME_COLOR, whiteSpace: "nowrap" }}>
                  {d.income > 0 ? formatAmount(d.income) : "-"}
                </div>
                <div style={{ fontSize: "0.65rem", fontWeight: 600, color: EXPENSE_COLOR, whiteSpace: "nowrap" }}>
                  {d.expenses > 0 ? formatAmount(d.expenses) : "-"}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
