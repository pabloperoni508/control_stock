import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { MovementType } from "@/types/movement";
import { MOVEMENT_TYPE_LABELS } from "@/types/movement";

interface StockMovementFormProps {
  stockUnitAbbr: string;
  submitting: boolean;
  error: string | null;
  onSubmit: (values: { type: MovementType; quantity: number; reason: string }) => void;
  onCancel: () => void;
}

// La "venta" queda afuera de este selector a propósito: se genera
// automáticamente desde el sistema de pedidos (Hito 3), no manualmente acá.
const availableTypes: MovementType[] = ["ingreso", "merma", "ajuste", "devolucion"];

export function StockMovementForm({
  stockUnitAbbr,
  submitting,
  error,
  onSubmit,
  onCancel,
}: StockMovementFormProps) {
  const [type, setType] = useState<MovementType>("ingreso");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const isAdjustment = type === "ajuste";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ type, quantity: Number(quantity), reason: reason.trim() });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.3rem",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
          }}
        >
          Tipo de movimiento
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MovementType)}
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
          }}
        >
          {availableTypes.map((t) => (
            <option key={t} value={t}>
              {MOVEMENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.3rem" }}>
          La venta se registra automáticamente desde el sistema de pedidos (Hito 3).
        </p>
      </div>

      <Input
        label={`Cantidad (${stockUnitAbbr})${isAdjustment ? " — usá negativo para restar" : ""}`}
        type="number"
        step="0.01"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      <Input
        label="Motivo / observación (opcional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      {error && (
        <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <Button type="submit" disabled={submitting} style={{ flex: 1 }}>
          {submitting ? "Guardando..." : "Registrar movimiento"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}