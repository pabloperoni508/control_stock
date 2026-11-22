import { useMemo } from "react";
import { useSalesHistory } from "@/hooks/useSalesHistory";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { paymentMethodLabel } from "@/config/paymentMethods";
import { formatAmount } from "@/utils/amount";
import { groupByWeek } from "@/utils/weeks";

export function BakeryBusinessPage() {
  const { sales, loading, loadingMore, hasMore, error, moreError, reload, loadMore } =
    useSalesHistory();

  const groups = useMemo(() => groupByWeek(sales, (sale) => sale.created_at), [sales]);

  return (
    <div>
      <h1>🏪 Gestión del negocio</h1>

      <h2 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>📋 Historial de ventas</h2>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Todas las ventas registradas, agrupadas por semana.
      </p>

      {loading && <p>Cargando historial...</p>}

      {!loading && error && (
        <div>
          <p style={{ color: "var(--color-danger)" }}>❌ {error}</p>
          <Button variant="secondary" onClick={() => void reload()}>
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && groups.length === 0 && (
        <p style={{ color: "var(--color-text-muted)" }}>Todavía no hay ventas registradas.</p>
      )}

      {!loading &&
        !error &&
        groups.map((group, index) => {
          // Si quedan páginas por cargar, la última semana puede estar incompleta.
          const isLastLoaded = index === groups.length - 1;
          const count = `${group.items.length}${hasMore && isLastLoaded ? "+" : ""}`;

          return (
            <Accordion key={group.key} title={`${group.label} (${count})`} defaultOpen={index === 0}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {group.items.map((sale) => (
                  <div
                    key={sale.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.75rem",
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.6rem 0.8rem",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <strong style={{ fontSize: "0.9rem", overflowWrap: "anywhere" }}>
                          {sale.customer_name || "Sin descripción"}
                        </strong>
                        <Badge variant="neutral">{paymentMethodLabel(sale.payment_method)}</Badge>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {new Date(sale.created_at).toLocaleString("es-AR")}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                      {sale.total !== null ? formatAmount(sale.total) : "-"}
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>
          );
        })}

      {!loading && !error && moreError && (
        <p style={{ color: "var(--color-danger)" }}>❌ {moreError}</p>
      )}
      {!loading && !error && hasMore && (
        <Button
          variant="secondary"
          onClick={() => void loadMore()}
          disabled={loadingMore}
          style={{ width: "100%", maxWidth: "520px", marginTop: "0.5rem" }}
        >
          {loadingMore ? "Cargando..." : "Cargar más ventas"}
        </Button>
      )}
    </div>
  );
}
