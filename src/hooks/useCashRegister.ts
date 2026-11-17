import { useCallback, useEffect, useState } from "react";
import { cashRegistersService } from "@/services/cashRegistersService";
import type { CashRegisterPeriod } from "@/types/cashRegister";
import { getErrorMessage } from "@/utils/errors";

export function useCashRegister() {
  const [openPeriod, setOpenPeriod] = useState<CashRegisterPeriod | null>(null);
  const [lastClosed, setLastClosed] = useState<CashRegisterPeriod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const open = await cashRegistersService.getOpenPeriod();
      const closed = open
        ? null
        : await cashRegistersService.getLastClosedPeriod();
      setOpenPeriod(open);
      setLastClosed(closed);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar el estado de la caja"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function openRegister() {
    await cashRegistersService.open();
    await load();
  }

  async function closeRegister() {
    await cashRegistersService.close();
    await load();
  }

  async function reopenLastRegister() {
    if (!lastClosed) throw new Error("No hay una caja cerrada para reabrir");
    await cashRegistersService.reopen(lastClosed.cash_register_id);
    await load();
  }

  return {
    openPeriod,
    lastClosed,
    loading,
    error,
    reload: load,
    openRegister,
    closeRegister,
    reopenLastRegister,
  };
}
