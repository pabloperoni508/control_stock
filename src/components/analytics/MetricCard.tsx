import { formatCurrency } from "@/utils/format";

interface MetricCardProps {
  label: string;
  value: number;
  changePercent: number | null;
}

export function MetricCard({ label, value, changePercent }: MetricCardProps) {
  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "1.25rem",
      }}
    >
      <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{label}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0.3rem 0" }}>
        {formatCurrency(value)}
      </div>
      {changePercent !== null && (
        <div
          style={{
            fontSize: "0.85rem",
            color: isPositive ? "var(--color-success)" : "var(--color-danger)",
            fontWeight: 600,
          }}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(changePercent).toFixed(1)}%
          <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>
            {" "}
            vs período anterior
          </span>
        </div>
      )}
    </div>
  );
}