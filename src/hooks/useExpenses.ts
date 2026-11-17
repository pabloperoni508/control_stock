import { useCallback, useEffect, useState } from "react";
import { EXPENSES_PAGE_SIZE, expensesService } from "@/services/expensesService";
import type { Expense } from "@/types/expense";
import { getErrorMessage } from "@/utils/errors";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moreError, setMoreError] = useState<string | null>(null);

  // Vuelve a cargar desde la primera página.
  const reload = useCallback(async () => {
    try {
      const page = await expensesService.list(0);
      setExpenses(page);
      setHasMore(page.length === EXPENSES_PAGE_SIZE);
      setError(null);
      setMoreError(null);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar los gastos"));
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
      const page = await expensesService.list(expenses.length);
      setExpenses((prev) => [...prev, ...page]);
      setHasMore(page.length === EXPENSES_PAGE_SIZE);
    } catch (err) {
      setMoreError(getErrorMessage(err, "No se pudieron cargar más gastos"));
    } finally {
      setLoadingMore(false);
    }
  }

  return { expenses, loading, loadingMore, hasMore, error, moreError, reload, loadMore };
}
