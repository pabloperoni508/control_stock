interface SimpleBarChartProps {
  data: { label: string; total: number }[];
}

export function SimpleBarChart({ data }: SimpleBarChartProps) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        height: "140px",
        padding: "1rem",
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        overflowX: "auto",
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          title={`${d.label}: ${d.total}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "100%",
            minWidth: data.length > 15 ? "8px" : "20px",
            flex: 1,
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${(d.total / max) * 100}%`,
              backgroundColor: "var(--color-primary)",
              borderRadius: "3px 3px 0 0",
              minHeight: d.total > 0 ? "3px" : "0",
            }}
          />
          {data.length <= 12 && (
            <div style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "4px" }}>
              {d.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}