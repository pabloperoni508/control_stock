import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOpenOrders } from "@/hooks/useOpenOrders";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export function OrdersPage() {
  const { orders, loading, createOrder } = useOpenOrders();
  const [creating, setCreating] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const navigate = useNavigate();

  async function handleCreate() {
    const order = await createOrder(customerName);
    setCreating(false);
    setCustomerName("");
    navigate(`/pedidos/${order.id}`);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0 }}>Hojas de pedido</h1>
        <Button onClick={() => setCreating(true)}>+ Nueva hoja de pedido</Button>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && orders.length === 0 && (
        <p style={{ color: "var(--color-text-muted)" }}>
          No hay hojas de pedido abiertas. Creá una con el botón de arriba.
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/pedidos/${order.id}`)}
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            <strong>{order.customer_name || "Sin nombre"}</strong>
            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              {new Date(order.created_at).toLocaleString("es-AR")}
            </div>
          </div>
        ))}
      </div>

      {creating && (
        <Modal title="Nueva hoja de pedido" onClose={() => setCreating(false)}>
          <Input
            label="Cliente (opcional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Ej: Pablo Peroni"
          />
          <Button onClick={handleCreate} style={{ width: "100%" }}>
            Crear hoja
          </Button>
        </Modal>
      )}
    </div>
  );
}