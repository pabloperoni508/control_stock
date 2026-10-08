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
import { Modal } from "@/components/ui/Modal";
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
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [updatingOwes, setUpdatingOwes] = useState(false);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);

  useEffect(() => {
    unitsService.getAll().then(setUnits);
  }, []);

  const isCompleted = order?.status === "completed";
  const isCancelled = order?.status === "cancelled";
  const isOpen = order?.status === "open";
  const allPrepared = items.length > 0 && items.every((i) => i.prepared);
  const roundingRule = settings?.rounding_rule ?? "none";

  const canClose = useMemo(
    () => isOpen && allPrepared && !closing,
    [isOpen, allPrepared, closing]
  );

  async function handleClose() {
    setClosing(true);
    setCloseError(null);
    try {
      await closeOrder();
      setShowPaymentPrompt(true);
    } catch (err) {
      setCloseError(
        err instanceof Error ? err.message : "Error al cerrar el pedido"
      );
    } finally {
      setClosing(false);
    }
  }

  async function handlePaymentAnswer(owes: boolean) {
    if (!order) return;
    setUpdatingOwes(true);
    try {
      if (owes) {
        await ordersService.updateOwes(order.id, true);
        await reload();
      }
    } finally {
      setUpdatingOwes(false);
      setShowPaymentPrompt(false);
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

  async function handleCancelOrder() {
    if (!order) return;
    const confirmed = window.confirm(
      "¿Cancelar este pedido? Se devolverá el stock vendido y se generará una nota de crédito. Esta acción no se puede deshacer."
    );
    if (!confirmed) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await ordersService.cancelOrder(order.id);
      await reload();
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Error al cancelar el pedido"
      );
    } finally {
      setCancelling(false);
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

  async function handleOwesChange(owes: boolean) {
    if (!order) return;
    setUpdatingOwes(true);
    try {
      await ordersService.updateOwes(order.id, owes);
      await reload();
    } finally {
      setUpdatingOwes(false);
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

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>{order.customer_name || "Pedido sin nombre"}</h1>
        {isCompleted && <Badge variant="success">Cerrado</Badge>}
        {isCancelled && <Badge variant="danger">Cancelado</Badge>}
        {isCompleted && order.owes && <Badge variant="warning">Debe</Badge>}
      </div>

      {isOpen && (
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

      {!isOpen && (
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: "0.5rem 0" }}>
          Precio aplicado: <strong>{order.price_mode === "business" ? "Negocio" : "Consumidor final"}</strong>
        </p>
      )}

      {!isOpen && order.total !== null && (
        <div
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            margin: "0.5rem 0 1rem",
            color: isCancelled ? "var(--color-danger)" : undefined,
          }}
        >
          Total: {formatCurrency(order.total)}
        </div>
      )}

      {isCompleted && (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
            margin: "0 0 1.5rem",
            cursor: updatingOwes ? "not-allowed" : "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={order.owes}
            disabled={updatingOwes}
            onChange={(e) => handleOwesChange(e.target.checked)}
            style={{ width: "18px", height: "18px" }}
          />
          Debe (entregado, pendiente de pago)
        </label>
      )}

      {cancelError && (
        <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>
          ❌ {cancelError}
        </p>
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
            readOnly={!isOpen}
            onTogglePrepared={(prepared) => togglePrepared(item.id, prepared)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      {isOpen && (
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
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
          <Button onClick={handleDownloadTicket} style={{ width: "100%" }}>
            📄 Descargar ticket (PDF)
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelOrder}
            disabled={cancelling}
            style={{ width: "100%" }}
          >
            {cancelling ? "Cancelando..." : "↩️ Cancelar pedido (nota de crédito)"}
          </Button>
        </div>
      )}

      {isCancelled && (
        <>
          <Button onClick={handleDownloadTicket} style={{ width: "100%", marginTop: "0.5rem" }}>
            📄 Descargar ticket original (PDF)
          </Button>
          <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>
            Este pedido fue cancelado. El stock vendido ya fue devuelto automáticamente.
          </p>
        </>
      )}

      {showPaymentPrompt && (
        <Modal title="Pedido cerrado ✅" onClose={() => setShowPaymentPrompt(false)}>
          <p style={{ marginTop: 0, marginBottom: "1.25rem" }}>
            ¿El cliente ya pagó este pedido?
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button
              onClick={() => handlePaymentAnswer(false)}
              disabled={updatingOwes}
              style={{ flex: 1 }}
            >
              Pagó
            </Button>
            <Button
              variant="secondary"
              onClick={() => handlePaymentAnswer(true)}
              disabled={updatingOwes}
              style={{ flex: 1 }}
            >
              Quedó debiendo
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}