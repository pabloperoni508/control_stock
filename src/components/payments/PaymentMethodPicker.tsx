import { Button } from "@/components/ui/Button";
import { PAYMENT_METHODS } from "@/config/paymentMethods";
import type { PaymentMethod } from "@/types/cashRegister";

interface PaymentMethodPickerProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodPicker({ value, onChange }: PaymentMethodPickerProps) {
  return (
    <>
      <div
        style={{
          marginBottom: "0.3rem",
          fontSize: "0.85rem",
          color: "var(--color-text-muted)",
        }}
      >
        Método de pago
      </div>
      <div
        role="group"
        aria-label="Método de pago"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {PAYMENT_METHODS.map((method) => (
          <Button
            key={method.value}
            type="button"
            variant={value === method.value ? "primary" : "secondary"}
            aria-pressed={value === method.value}
            onClick={() => onChange(method.value)}
          >
            {method.label}
          </Button>
        ))}
      </div>
    </>
  );
}
