import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ordersService } from "@/services/ordersService";
import { creditNotesService } from "@/services/creditNotesService";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/format";

interface HistoryEntry {
  orderId: string;
  type: "completed" | "cancelled";
  customerName: string | null;
  total: number | null;
  date: string;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `Semana del ${fmt(weekStart)} al ${fmt(weekEnd)}`;
}

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ordersService.getAllCompleted(), creditNotesService.getAll()]).then(
      ([completed, cancelled]) => {
        const completedEntries: HistoryEntry[] = completed.map((o) => ({
          orderId: o.id,
          type: "completed",
          customerName: o.customer_name,
          total: o.total,
          date: o.completed_at ?? o.created_at,
        }));

        const cancelledEntries: HistoryEntry[] = cancelled.map((cn) => ({
          orderId: cn.order_id,
          type: "cancelled",
          customerName: cn.customer_name,
          total: cn.total,
          date: cn.created_at,
        }));

        const all = [...completedEntries, ...cancelledEntries].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setEntries(all);
        setLoading(false);
      }
    );
  }, []);

  const groups = new Map<number, { label: string; items: HistoryEntry[] }>();
  for (const entry of entries) {
    const weekStart = getWeekStart(new Date(entry.date));
    const key = weekStart.getTime();
    if (!groups.has(key)) {
      groups.set(key, { label: formatWeekLabel(weekStart), items: [] });
    }
    groups.get(key)!.items.push(entry);
  }

  const sortedWeekKeys = Array.from(groups.keys()).sort((a, b) => b - a);

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate("/pedidos")}>
        ← Volver a hojas de pedido
      </Button>

      <h1>📋 Historial de pedidos</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Todos los pedidos cerrados y cancelados, agrupados por semana.
      </p>

      {loading && <p>Cargando historial...</p>}

      {!loading && sortedWeekKeys.length === 0 && (
        <p style={{ color: "var(--color-text-muted)" }}>
          Todavía no hay pedidos cerrados ni cancelados.
        </p>
      )}

      {sortedWeekKeys.map((key, index) => {
        const group = groups.get(key)!;
        return (
          <Accordion key={key} title={`${group.label} (${group.items.length})`} defaultOpen={index === 0}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {group.items.map((entry) => (
                <div
                  key={`${entry.orderId}-${entry.type}-${entry.date}`}
                  onClick={() => navigate(`/pedidos/${entry.orderId}`)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.6rem 0.8rem",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <strong style={{ fontSize: "0.9rem" }}>
                        {entry.customerName || "Sin nombre"}
                      </strong>
                      <Badge variant={entry.type === "completed" ? "success" : "danger"}>
                        {entry.type === "completed" ? "Cerrado" : "Cancelado"}
                      </Badge>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                      {new Date(entry.date).toLocaleString("es-AR")}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: entry.type === "cancelled" ? "var(--color-danger)" : undefined,
                    }}
                  >
                    {entry.total !== null
                      ? `${entry.type === "cancelled" ? "-" : ""}${formatCurrency(entry.total)}`
                      : "-"}
                  </div>
                </div>
              ))}
            </div>
          </Accordion>
        );
      })}
    </div>
  );
}