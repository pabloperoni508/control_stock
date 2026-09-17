import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, style, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            marginBottom: "0.3rem",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        style={{
          width: "100%",
          padding: "0.6rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--color-border)",
          fontSize: "0.95rem",
          ...style,
        }}
      />
    </div>
  );
}