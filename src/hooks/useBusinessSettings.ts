import { useCallback, useEffect, useState } from "react";
import { settingsService } from "@/services/settingsService";
import type { BusinessSettings, BusinessSettingsUpdate } from "@/types/settings";

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingsService.get();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la configuración");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateSettings(changes: BusinessSettingsUpdate) {
    if (!settings) return;
    await settingsService.update(settings.id, changes);
    await load();
  }

  return { settings, loading, error, updateSettings };
}