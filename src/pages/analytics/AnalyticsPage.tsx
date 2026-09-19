import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "@/services/analyticsService";
import { useProducts } from "@/hooks/useProducts";
import { movementsService } from "@/services/movementsService";
import { getPeriodRange, summarizeSales, buildProductRanking } from "@/utils/analytics";
import { MetricCard } from "@/components/analytics/MetricCard";
import { SimpleBarChart } from "@/components/analytics/SimpleBarChart";
import { TopProductsList } from "@/components/analytics/TopProductsList";
import { StockAlerts } from "@/components/analytics/StockAlerts";
import { Button } from "@/components/ui/Button";
import type { PeriodOption, SaleRecord } from "@/types/analytics";

const LOW_ROTATION_DAYS = 20; // se vuelve configurable en la Fase 11

const periodLabels: Record<PeriodOption, string> = {
  week: "Semana",
  month: "Mes",
  year: "Año",
};

export function AnalyticsPage() {
  const navigate = useNavigate();
  const { products } = useProducts();

  const [period, setPeriod] = useState<PeriodOption>("week");
  const [currentSales, setCurrentSales] = useState<SaleRecord[]>([]);
  const [previousSales, setPreviousSales] = useState<SaleRecord[]>([]);
  const [lastMovementByProduct, setLastMovementByProduct] = useState<Map<string, string>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);

  const { from: currentFrom, to: currentTo } = getPeriodRange(period, 0);
  const { from: prevFrom, to: prevTo } = getPeriodRange(period, -1);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      analyticsService.getSalesBetween(currentFrom, currentTo),
      analyticsService.getSalesBetween(prevFrom, prevTo),
    ]).then(([current, previous]) => {
      setCurrentSales(current);
      setPreviousSales(previous);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  useEffect(() => {
    // Última fecha de movimiento (de cualquier tipo) por producto, para rotación.
    async function loadLastMovements() {
      const map = new Map<string, string>();
      await Promise.all(
        products.map(async (p) => {
          const movements = await movementsService.getByProduct(p.id);
          if (movements.length > 0) {
            map.set(p.id, movements[0].created_at); // ya vienen ordenados desc
          }
        })
      );
      setLastMovementByProduct(map);
    }

    if (products.length > 0) loadLastMovements();
  }, [products]);

  const summary = useMemo(
    () => summarizeSales(currentSales, previousSales, period, currentFrom),
    [currentSales, previousSales, period, currentFrom]
  );

  const ranking = useMemo(() => buildProductRanking(currentSales), [currentSales]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1 style={{ margin: 0 }}>📊 Analíticas</h1>
        <Button onClick={() => navigate("/pedidos")}>🛒 Vender</Button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {(["week", "month", "year"] as PeriodOption[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              padding: "0.4rem 0.9rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: period === p ? "var(--color-primary)" : "var(--color-surface)",
              color: period === p ? "#fff" : "var(--color-text)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Cargando analíticas...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <MetricCard
            label={`Ventas esta ${periodLabels[period].toLowerCase()}`}
            value={summary.total}
            changePercent={summary.changePercent}
          />

          <SimpleBarChart data={summary.dailyTotals} />

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>🏆 Top productos</h2>
            <TopProductsList ranking={ranking} />
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Alertas</h2>
            <StockAlerts
              products={products}
              lowRotationDays={LOW_ROTATION_DAYS}
              lastMovementByProduct={lastMovementByProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
}