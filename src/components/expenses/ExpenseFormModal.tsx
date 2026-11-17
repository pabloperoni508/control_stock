import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PaymentMethodPicker } from "@/components/payments/PaymentMethodPicker";
import { expensesService } from "@/services/expensesService";
import { parseAmount } from "@/utils/amount";
import { todayLocalISO } from "@/utils/datetime";
import { getErrorMessage } from "@/utils/errors";
import type { Expense } from "@/types/expense";
import type { PaymentMethod } from "@/types/cashRegister";

interface ExpenseFormModalProps {
  onClose: () => void;
  onSaved: (expense: Expense) => void;
}

export function ExpenseFormModal({ onClose, onSaved }: ExpenseFormModalProps) {
  const today = todayLocalISO();

  const [description, setDescription] = useState("");
  const [amountText, setAmountText] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [expenseDate, setExpenseDate] = useState(today);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;

    const text = description.trim();
    const amount = parseAmount(amountText);

    if (!text) {
      setError("Escribí en qué se gastó.");
      return;
    }
    if (amount === null) {
      setError("Ingresá un importe mayor a cero (por ejemplo 1500 o 1500,50).");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expenseDate)) {
      setError("Elegí la fecha del gasto.");
      return;
    }
    if (expenseDate > today) {
      setError("La fecha del gasto no puede ser futura.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const expense = await expensesService.create({
        description: text,
        amount,
        paymentMethod,
        expenseDate,
      });
      onSaved(expense);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo registrar el gasto"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Nuevo gasto" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Input
          id="expense-description"
          label="¿En qué se gastó?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Compra de harina"
          autoFocus
          autoComplete="off"
        />
        <Input
          id="expense-amount"
          label="Importe"
          value={amountText}
          onChange={(e) => setAmountText(e.target.value)}
          placeholder="Ej: 25000"
          inputMode="decimal"
          autoComplete="off"
        />

        <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />

        <Input
          id="expense-date"
          label="Fecha"
          type="date"
          value={expenseDate}
          max={today}
          onChange={(e) => setExpenseDate(e.target.value)}
        />

        {error && (
          <p style={{ color: "var(--color-danger)", marginTop: 0 }}>❌ {error}</p>
        )}

        <Button
          type="submit"
          disabled={saving}
          style={{ width: "100%", minHeight: "48px" }}
        >
          {saving ? "Guardando..." : "Guardar gasto"}
        </Button>
      </form>
    </Modal>
  );
}
