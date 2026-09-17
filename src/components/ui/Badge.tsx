import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const colors: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: "#e5f3e6", text: "var(--color-success)" },
  warning: { bg: "#fbf0dc", text: "var(--color-warning)" },
  danger: { bg: "#fbe3e3", text: "var(--color-danger)" },
  neutral: { bg: "#eee8e0", text: "var(--color-text-muted)" },
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  const { bg, text } = colors[variant];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.6rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
      }}
    >
      {children}
    </span>
  );
}