import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ordersService } from "@/services/ordersService";
import { formatCurrency } from "@/utils/format";
import type { Order } from "@/types/order";

interface OrderWithItems extends Order {
  itemsLabel: string;
}

export function TodaySummary() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const todays = await ordersService.getCompletedToday();
      const withItems = await Promise.all(
        todays.map(async (o) => {
          const items = await ordersService.getItemsSummary(o.id);
          return { ...o, itemsLabel: items.join(", ") || "Sin productos" };
        })
      );
      setOrders(withItems);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p style={{ fontSize: "0.85rem" }}>Cargando...</p>;

  if (orders.length === 0) {
    return (
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
        Todavía no se cerró ningún pedido hoy.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      {orders.map((o) => (
        <div
          key={o.id}
          onClick={() => navigate(`/pedidos/${o.id}`)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            padding: "0.75rem 1rem",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ fontSize: "0.9rem" }}>{o.customer_name || "Sin nombre"}</strong>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-muted)",
                marginTop: "0.2rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {o.itemsLabel}
            </div>
          </div>
          <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
            {o.total !== null ? formatCurrency(o.total) : "-"}
          </div>
        </div>
      ))}
    </div>
  );
}