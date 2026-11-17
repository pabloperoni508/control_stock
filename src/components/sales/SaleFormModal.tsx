import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PaymentMethodPicker } from "@/components/payments/PaymentMethodPicker";
import { PAYMENT_METHODS } from "@/config/paymentMethods";
import { salesService } from "@/services/salesService";
import { parseAmount } from "@/utils/amount";
import { getErrorMessage } from "@/utils/errors";
import type { Order } from "@/types/order";
import type { PaymentMethod } from "@/types/cashRegister";

interface SaleFormModalProps {
  // Si se pasa una venta, el formulario la edita; si no, registra una nueva.
  sale?: Order;
  onClose: () => void;
  onSaved: (order: Order) => void;
  // Se llama si el servidor rechaza la operación, para refrescar el estado de la caja.
  onFailure: () => void;
}

function initialMethod(sale?: Order): PaymentMethod {
  const found = PAYMENT_METHODS.find((m) => m.value === sale?.payment_method);
  return found ? found.value : "cash";
}

export function SaleFormModal({
  sale,
  onClose,
  onSaved,
  onFailure,
}: SaleFormModalProps) {
  const isEditing = sale !== undefined;

  const [description, setDescription] = useState(sale?.customer_name ?? "");
  const [amountText, setAmountText] = useState(
    sale?.total != null ? String(sale.total).replace(".", ",") : ""
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialMethod(sale)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;

    const text = description.trim();
    const amount = parseAmount(amountText);

    if (!text) {
      setError("Escribí qué vendiste.");
      return;
    }
    if (amount === null) {
      setError("Ingresá un importe mayor a cero (por ejemplo 1500 o 1500,50).");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const order = sale
        ? await salesService.update(sale.id, text, amount, paymentMethod)
        : await salesService.register(text, amount, paymentMethod);
      onSaved(order);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          isEditing ? "No se pudo modificar la venta" : "No se pudo registrar la venta"
        )
      );
      onFailure();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={isEditing ? "Editar venta" : "Nueva venta"} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Input
          id="sale-description"
          label="¿Qué vendiste?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: 1 kg de facturas"
          autoFocus
          autoComplete="off"
        />
        <Input
          id="sale-amount"
          label="Importe"
          value={amountText}
          onChange={(e) => setAmountText(e.target.value)}
          placeholder="Ej: 1500"
          inputMode="decimal"
          autoComplete="off"
        />

        <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />

        {error && (
          <p style={{ color: "var(--color-danger)", marginTop: 0 }}>❌ {error}</p>
        )}

        <Button
          type="submit"
          disabled={saving}
          style={{ width: "100%", minHeight: "48px" }}
        >
          {saving
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Confirmar venta"}
        </Button>
      </form>
    </Modal>
  );
}
