import { useCallback, useEffect, useState } from "react";
import { SALES_HISTORY_PAGE_SIZE, salesService } from "@/services/salesService";
import type { Order } from "@/types/order";
import { getErrorMessage } from "@/utils/errors";

export function useSalesHistory() {
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moreError, setMoreError] = useState<string | null>(null);

  // Vuelve a cargar desde la primera página.
  const reload = useCallback(async () => {
    try {
      const page = await salesService.listHistory(0);
      setSales(page);
      setHasMore(page.length === SALES_HISTORY_PAGE_SIZE);
      setError(null);
      setMoreError(null);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar el historial de ventas"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function loadMore() {
    setLoadingMore(true);
    setMoreError(null);
    try {
      const page = await salesService.listHistory(sales.length);
      setSales((prev) => [...prev, ...page]);
      setHasMore(page.length === SALES_HISTORY_PAGE_SIZE);
    } catch (err) {
      setMoreError(getErrorMessage(err, "No se pudieron cargar más ventas"));
    } finally {
      setLoadingMore(false);
    }
  }

  return { sales, loading, loadingMore, hasMore, error, moreError, reload, loadMore };
}
