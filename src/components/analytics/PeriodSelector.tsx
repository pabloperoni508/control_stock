import { PERIOD_LABELS } from "@/config/finance";
import type { PeriodOption } from "@/types/analytics";

const OPTIONS: PeriodOption[] = ["week", "month", "year"];

interface PeriodSelectorProps {
  value: PeriodOption;
  onChange: (period: PeriodOption) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            backgroundColor:
              value === option ? "var(--color-primary)" : "var(--color-surface)",
            color:
              value === option
                ? "var(--color-primary-contrast, #fff)"
                : "var(--color-text)",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          {PERIOD_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
