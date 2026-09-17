import type { ButtonHTMLAttributes, CSSProperties } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-primary)",
    color: "#fff",
    border: "none",
  },
  secondary: {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
  },
  danger: {
    backgroundColor: "var(--color-danger)",
    color: "#fff",
    border: "none",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--color-text)",
    border: "none",
  },
};

export function Button({ variant = "primary", style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        padding: "0.6rem 1.1rem",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.95rem",
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.6 : 1,
        fontWeight: 600,
        ...variantStyles[variant],
        ...style,
      }}
    />
  );
}