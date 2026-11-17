import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCashRegister } from "@/hooks/useCashRegister";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SaleFormModal } from "@/components/sales/SaleFormModal";
import { SalesList } from "@/components/sales/SalesList";
import { formatAmount } from "@/utils/amount";
import { formatDateTime } from "@/utils/datetime";
import { getErrorMessage } from "@/utils/errors";
import type { Order } from "@/types/order";

export function VentasPage() {
  const { organization } = useAuth();
  const {
    openPeriod,
    lastClosed,
    loading,
    error,
    reload,
    openRegister,
    closeRegister,
    reopenLastRegister,
  } = useCashRegister();

  const [selling, setSelling] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [salesVersion, setSalesVersion] = useState(0);

  // Solo mejora la interfaz: la regla real la aplica la función de la base.
  const isAdmin = organization?.role === "admin";

  async function runAction(action: () => Promise<void>) {
    setBusy(true);
    setActionError(null);
    setNotice(null);
    try {
      await action();
    } catch (err) {
      setActionError(getErrorMessage(err, "No se pudo completar la acción"));
      await reload();
    } finally {
      setBusy(false);
    }
  }

  function handleClose() {
    if (
      !window.confirm(
        "¿Cerrar la caja? No se podrán registrar ni modificar ventas hasta reabrirla."
      )
    ) {
      return;
    }
    void runAction(closeRegister);
  }

  function handleReopen() {
    if (!window.confirm("¿Reabrir la última caja cerrada?")) return;
    void runAction(reopenLastRegister);
  }

  function handleSaved(order: Order) {
    setSelling(false);
    setActionError(null);
    setSalesVersion((v) => v + 1);
    setNotice(
      `✅ Venta registrada: ${order.customer_name ?? ""} · ${formatAmount(order.total ?? 0)}`
    );
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

  const isOpen = openPeriod !== null;

  return (
    <div style={{ maxWidth: "520px" }}>
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.4rem",
          }}
        >
          <strong>Caja</strong>
          <Badge variant={isOpen ? "success" : "neutral"}>
            {isOpen ? "Abierta" : "Cerrada"}
          </Badge>
        </div>

        <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          {isOpen && openPeriod
            ? `Abierta desde ${formatDateTime(openPeriod.opened_at)}`
            : lastClosed?.closed_at
              ? `Última caja cerrada el ${formatDateTime(lastClosed.closed_at)}`
              : "Todavía no hay cajas registradas."}
        </div>

        {isOpen && (
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={busy}
            style={{ marginTop: "0.75rem", padding: "0.4rem 0.9rem" }}
          >
            Cerrar caja
          </Button>
        )}
      </div>

      {notice && <p style={{ color: "var(--color-success)" }}>{notice}</p>}
      {actionError && (
        <p style={{ color: "var(--color-danger)" }}>❌ {actionError}</p>
      )}

      {isOpen && openPeriod ? (
        <>
          <Button
            onClick={() => {
              setNotice(null);
              setSelling(true);
            }}
            disabled={busy}
            style={{ width: "100%", minHeight: "56px", fontSize: "1.1rem" }}
          >
            + Nueva venta
          </Button>

          <SalesList
            registerId={openPeriod.cash_register_id}
            version={salesVersion}
            onStateStale={() => void reload()}
          />
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Button
            onClick={() => void runAction(openRegister)}
            disabled={busy}
            style={{ minHeight: "56px", fontSize: "1.1rem" }}
          >
            Abrir caja
          </Button>
          {isAdmin && lastClosed && (
            <Button variant="secondary" onClick={handleReopen} disabled={busy}>
              Reabrir última caja
            </Button>
          )}
        </div>
      )}

      {selling && (
        <SaleFormModal
          onClose={() => setSelling(false)}
          onSaved={handleSaved}
          onFailure={() => void reload()}
        />
      )}
    </div>
  );
}
