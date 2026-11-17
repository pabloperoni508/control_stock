import type { PaymentMethod } from "@/types/cashRegister";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Efectivo" },
  { value: "transfer", label: "Transferencia" },
  { value: "card", label: "Tarjeta" },
  { value: "other", label: "Otro" },
];

export function paymentMethodLabel(method: string | null): string {
  return PAYMENT_METHODS.find((m) => m.value === method)?.label ?? "—";
}
