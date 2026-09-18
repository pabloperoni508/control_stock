import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "@/hooks/useOrder";
import { useProducts } from "@/hooks/useProducts";
import { unitsService } from "@/services/unitsService";
import { useEffect, useState } from "react";
import { AddOrderItemForm } from "@/components/orders/AddOrderItemForm";
import { OrderItemRow } from "@/components/orders/OrderItemRow";
import { Button } from "@/components/ui/Button";
import type { Unit } from "@/types/product";

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { order, items, loading, addItem, togglePrepared, removeItem } = useOrder(
    orderId ?? ""
  );
  const { products } = useProducts();
  const [units, setUnits] = useState<Unit[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    unitsService.getAll().then(setUnits);
  }, []);

  if (loading) return <p>Cargando pedido...</p>;
  if (!order) return <p>Pedido no encontrado.</p>;

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate("/pedidos")}>
        ← Volver a hojas de pedido
      </Button>

      <h1>{order.customer_name || "Pedido sin nombre"}</h1>

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
            onTogglePrepared={(prepared) => togglePrepared(item.id, prepared)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

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

      <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "1.5rem" }}>
        El botón "Pedido listo" (que descuenta el stock) lo agregamos en la próxima fase.
      </p>
    </div>
  );
}