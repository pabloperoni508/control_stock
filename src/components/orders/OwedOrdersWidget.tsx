import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ordersService } from "@/services/ordersService";
import { formatCurrency } from "@/utils/format";
import type { Order } from "@/types/order";

export function OwedOrdersWidget() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersService.getOwed().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

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
        📒 Pedidos fiados ({orders.length})
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
            {order.total !== null && (
              <span style={{ color: "var(--color-text-muted)" }}>
                {" · "}
                {formatCurrency(order.total)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}