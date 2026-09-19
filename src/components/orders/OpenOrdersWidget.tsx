import { useNavigate } from "react-router-dom";
import { useOpenOrders } from "@/hooks/useOpenOrders";

export function OpenOrdersWidget() {
  const { orders, loading } = useOpenOrders();
  const navigate = useNavigate();

  if (loading || orders.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <strong style={{ fontSize: "0.9rem" }}>
        🛒 Pedidos en preparación ({orders.length})
      </strong>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => navigate(`/pedidos/${order.id}`)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-bg)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {order.customer_name || "Sin nombre"}
          </button>
        ))}
      </div>
    </div>
  );
}