import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { Button } from "@/components/ui/Button";
import { ExpenseFormModal } from "@/components/expenses/ExpenseFormModal";
import { paymentMethodLabel } from "@/config/paymentMethods";
import { formatAmount } from "@/utils/amount";
import { formatDateOnly } from "@/utils/datetime";
import type { Expense } from "@/types/expense";

// Agrupa gastos ya ordenados por fecha: un bloque por día, cada día una sola vez.
function groupByDate(expenses: Expense[]): { date: string; items: Expense[] }[] {
  const groups: { date: string; items: Expense[] }[] = [];
  for (const expense of expenses) {
    const last = groups[groups.length - 1];
    if (last && last.date === expense.expense_date) {
      last.items.push(expense);
    } else {
      groups.push({ date: expense.expense_date, items: [expense] });
    }
  }
  return groups;
}

export function AdministracionPage() {
  const { expenses, loading, loadingMore, hasMore, error, moreError, reload, loadMore } =
    useExpenses();
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function handleSaved(expense: Expense) {
    setCreating(false);
    setNotice(
      `✅ Gasto registrado: ${expense.description} · ${formatAmount(expense.amount)}`
    );
    void reload();
  }

  if (loading) return <p>Cargando...</p>;

  if (error) {
    return (
      <div>
        <p style={{ color: "var(--color-danger)" }}>❌ {error}</p>
        <Button variant="secondary" onClick={() => void reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  const groups = groupByDate(expenses);

  return (
    <div style={{ maxWidth: "520px" }}>
      <Button
        onClick={() => {
          setNotice(null);
          setCreating(true);
        }}
        style={{ width: "100%", minHeight: "56px", fontSize: "1.1rem" }}
      >
        + Nuevo gasto
      </Button>

      {notice && <p style={{ color: "var(--color-success)" }}>{notice}</p>}

      {expenses.length === 0 && (
        <p style={{ color: "var(--color-text-muted)", marginTop: "1.25rem" }}>
          Todavía no hay gastos registrados.
        </p>
      )}

      {groups.map((group) => (
        <section key={group.date} style={{ marginTop: "1.25rem" }}>
          <h2 style={{ fontSize: "1rem", margin: "0 0 0.6rem" }}>
            {formatDateOnly(group.date)}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {group.items.map((expense) => (
              <div
                key={expense.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.75rem 1rem",
                }}
              >
                <span style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", overflowWrap: "anywhere" }}>
                    {expense.description}
                  </strong>
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}
                  >
                    {paymentMethodLabel(expense.payment_method)}
                  </span>
                </span>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    fontWeight: 600,
                    color: "var(--color-danger)",
                  }}
                >
                  {formatAmount(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}

      {moreError && (
        <p style={{ color: "var(--color-danger)" }}>❌ {moreError}</p>
      )}
      {hasMore && (
        <Button
          variant="secondary"
          onClick={() => void loadMore()}
          disabled={loadingMore}
          style={{ width: "100%", marginTop: "1.25rem" }}
        >
          {loadingMore ? "Cargando..." : "Cargar más"}
        </Button>
      )}

      {creating && (
        <ExpenseFormModal onClose={() => setCreating(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}
