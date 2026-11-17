import { formatCurrency } from "@/utils/format";

interface MetricCardProps {
  label: string;
  value: number;
  changePercent: number | null;
  // Opcionales: sin ellos la tarjeta se comporta exactamente igual que antes.
  accentColor?: string; // color del importe
  higherIsBetter?: boolean; // false para egresos: subir es "malo"
  formatValue?: (value: number) => string;
}

export function MetricCard({
  label,
  value,
  changePercent,
  accentColor,
  higherIsBetter = true,
  formatValue = formatCurrency,
}: MetricCardProps) {
  const isPositive = (changePercent ?? 0) >= 0;
  const isGood = higherIsBetter ? isPositive : !isPositive;

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
      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          margin: "0.3rem 0",
          color: accentColor,
        }}
      >
        {formatValue(value)}
      </div>
      {changePercent !== null && (
        <div
          style={{
            fontSize: "0.85rem",
            color: isGood ? "var(--color-success)" : "var(--color-danger)",
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
