import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "@/hooks/useOrder";
import { useProducts } from "@/hooks/useProducts";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { unitsService } from "@/services/unitsService";
import { ordersService } from "@/services/ordersService";
import { useEffect, useMemo, useState } from "react";
import { AddOrderItemForm } from "@/components/orders/AddOrderItemForm";
import { OrderItemRow } from "@/components/orders/OrderItemRow";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/format";
import { calculateItemSubtotal } from "@/utils/pricing";
import { generateOrderTicket } from "@/utils/ticket";
import type { Unit } from "@/types/product";

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const {
    order,
    items,
    loading,
    error,
    reload,
    addItem,
    togglePrepared,
    removeItem,
    closeOrder,
  } = useOrder(orderId ?? "");
  const { products } = useProducts();
  const { settings } = useBusinessSettings();
  const [units, setUnits] = useState<Unit[]>([]);
  const [adding, setAdding] = useState(false);
  const [closing, setClosing] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);
  const [changingMode, setChangingMode] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    unitsService.getAll().then(setUnits);
  }, []);

  const isCompleted = order?.status === "completed";
  const allPrepared = items.length > 0 && items.every((i) => i.prepared);
  const roundingRule = settings?.rounding_rule ?? "none";

  const canClose = useMemo(
    () => !isCompleted && allPrepared && !closing,
    [isCompleted, allPrepared, closing]
  );

  async function handleClose() {
    setClosing(true);
    setCloseError(null);
    try {
      await closeOrder();
    } catch (err) {
      setCloseError(
        err instanceof Error ? err.message : "Error al cerrar el pedido"
      );
    } finally {
      setClosing(false);
    }
  }

  async function handleDownloadTicket() {
    if (!order) return;
    await generateOrderTicket(order, items, roundingRule);
  }

  async function handleDeleteOrder() {
    if (!order) return;
    const confirmed = window.confirm(
      "¿Seguro que querés eliminar esta hoja de pedido? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await ordersService.delete(order.id);
      navigate("/pedidos");
    } finally {
      setDeleting(false);
    }
  }

  async function handlePriceModeClick(mode: "customer" | "business") {
    if (!order) return;
    setChangingMode(true);
    try {
      await ordersService.updatePriceMode(order.id, mode);
      await reload();
    } finally {
      setChangingMode(false);
    }
  }

  if (loading) return <p>Cargando pedido...</p>;
  if (error) return <p style={{ color: "var(--color-danger)" }}>❌ {error}</p>;
  if (!order) return <p>Pedido no encontrado.</p>;

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate("/pedidos")}>
        ← Volver a hojas de pedido
      </Button>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <h1 style={{ margin: 0 }}>{order.customer_name || "Pedido sin nombre"}</h1>
        {isCompleted && <Badge variant="success">Cerrado</Badge>}
      </div>

      {!isCompleted && (
        <div style={{ display: "flex", gap: "0.5rem", margin: "0.75rem 0" }}>
          {(["customer", "business"] as const).map((mode) => (
            <button
              key={mode}
              disabled={changingMode}
              onClick={() => handlePriceModeClick(mode)}
              style={{
                padding: "0.4rem 0.9rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                backgroundColor: order.price_mode === mode ? "var(--color-primary)" : "var(--color-surface)",
                color: order.price_mode === mode ? "#fff" : "var(--color-text)",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {mode === "customer" ? "Consumidor final" : "Negocio"}
            </button>
          ))}
        </div>
      )}

      {isCompleted && (
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: "0.5rem 0" }}>
          Precio aplicado: <strong>{order.price_mode === "business" ? "Negocio" : "Consumidor final"}</strong>
        </p>
      )}

      {isCompleted && order.total !== null && (
        <div
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            margin: "0.5rem 0 1.5rem",
          }}
        >
          Total: {formatCurrency(order.total)}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {items.length === 0 && (
          <p style={{ color: "var(--color-text-muted)" }}>
            Todavía no agregaste productos a este pedido.
          </p>
        )}
        {items.map((item) => (
          <OrderItemRow
            key={item.id}
            item={item}
            subtotal={calculateItemSubtotal(item, roundingRule, order.price_mode)}
            readOnly={isCompleted}
            onTogglePrepared={(prepared) => togglePrepared(item.id, prepared)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      {!isCompleted && (
        <>
          <AddOrderItemForm
            products={products}
            units={units}
            submitting={adding}
            onAdd={async (values) => {
              setAdding(true);
              try {
                await addItem(values);
              } finally {
                setAdding(false);
              }
            }}
          />

          <div style={{ marginTop: "1.5rem" }}>
            {items.length > 0 && !allPrepared && (
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                Marcá todos los ítems como preparados para poder cerrar el pedido.
              </p>
            )}

            {closeError && (
              <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>
                ❌ {closeError}
              </p>
            )}

            <Button onClick={handleClose} disabled={!canClose} style={{ width: "100%" }}>
              {closing ? "Cerrando pedido..." : "✅ Pedido listo"}
            </Button>

            <Button
              variant="danger"
              onClick={handleDeleteOrder}
              disabled={deleting}
              style={{ width: "100%", marginTop: "0.75rem" }}
            >
              {deleting ? "Eliminando..." : "🗑️ Eliminar pedido"}
            </Button>
          </div>
        </>
      )}

      {isCompleted && (
        <Button onClick={handleDownloadTicket} style={{ width: "100%", marginTop: "0.5rem" }}>
          📄 Descargar ticket (PDF)
        </Button>
      )}
    </div>
  );
}