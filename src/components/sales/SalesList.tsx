import { useEffect, useState } from "react";
import { SaleFormModal } from "@/components/sales/SaleFormModal";
import { Button } from "@/components/ui/Button";
import { paymentMethodLabel } from "@/config/paymentMethods";
import { salesService } from "@/services/salesService";
import { formatAmount } from "@/utils/amount";
import { formatTime } from "@/utils/datetime";
import { getErrorMessage } from "@/utils/errors";
import type { Order } from "@/types/order";

interface SalesListProps {
  registerId: string;
  // Cambia cada vez que se registra una venta nueva, para recargar la lista.
  version: number;
  // Se llama si el servidor rechaza una edición (por ejemplo, la caja se cerró).
  onStateStale: () => void;
}

export function SalesList({ registerId, version, onStateStale }: SalesListProps) {
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Order | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    salesService
      .listByRegister(registerId)
      .then((data) => {
        if (cancelled) return;
        setSales(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(getErrorMessage(err, "No se pudieron cargar las ventas"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [registerId, version, reloadKey]);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  return (
    <section style={{ marginTop: "1.25rem" }}>
      <h2 style={{ fontSize: "1rem", margin: "0 0 0.6rem" }}>
        Ventas de esta caja{!loading && !error ? ` (${sales.length})` : ""}
      </h2>

      {loading && <p>Cargando...</p>}

      {error && (
        <div>
          <p style={{ color: "var(--color-danger)" }}>❌ {error}</p>
          <Button variant="secondary" onClick={reload}>
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && sales.length === 0 && (
        <p style={{ color: "var(--color-text-muted)" }}>
          Todavía no hay ventas en esta caja.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {sales.map((sale) => (
          <button
            key={sale.id}
            type="button"
            onClick={() => setEditing(sale)}
            aria-label={`Editar venta: ${sale.customer_name ?? ""}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.75rem",
              width: "100%",
              textAlign: "left",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem 1rem",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            <span style={{ minWidth: 0 }}>
              <strong style={{ display: "block", overflowWrap: "anywhere" }}>
                {sale.customer_name || "Sin descripción"}
              </strong>
              <span
                style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}
              >
                {formatTime(sale.created_at)} ·{" "}
                {paymentMethodLabel(sale.payment_method)}
              </span>
            </span>
            <span style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
              {formatAmount(sale.total ?? 0)} ✏️
            </span>
          </button>
        ))}
      </div>

      {editing && (
        <SaleFormModal
          sale={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
          onFailure={() => {
            reload();
            onStateStale();
          }}
        />
      )}
    </section>
  );
}