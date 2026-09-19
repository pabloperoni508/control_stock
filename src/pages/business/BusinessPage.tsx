import { useState, useEffect } from "react";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function BusinessPage() {
  const { settings, loading, error, updateSettings } = useBusinessSettings();

  const [lowRotationDays, setLowRotationDays] = useState("20");
  const [globalMinStockAlert, setGlobalMinStockAlert] = useState(true);
  const [allowNegativeStock, setAllowNegativeStock] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setLowRotationDays(String(settings.low_rotation_days));
      setGlobalMinStockAlert(settings.global_min_stock_alert);
      setAllowNegativeStock(settings.allow_negative_stock);
    }
  }, [settings]);

  async function handleSave() {
    setSubmitting(true);
    setSaved(false);
    try {
      await updateSettings({
        low_rotation_days: Number(lowRotationDays),
        global_min_stock_alert: globalMinStockAlert,
        allow_negative_stock: allowNegativeStock,
      });
      setSaved(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Cargando configuración...</p>;
  if (error) return <p style={{ color: "var(--color-danger)" }}>❌ {error}</p>;

  return (
    <div>
      <h1>🏪 Gestión del negocio</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Variables generales que afectan a toda la aplicación.
      </p>

      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "1.5rem",
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <Input
          label="Días para considerar baja rotación"
          type="number"
          min={1}
          value={lowRotationDays}
          onChange={(e) => setLowRotationDays(e.target.value)}
        />
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "-0.7rem" }}>
          Se usa en Analíticas para marcar productos sin movimiento reciente.
        </p>

        <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "0.5rem 0" }}>
          <input
            type="checkbox"
            checked={globalMinStockAlert}
            onChange={(e) => setGlobalMinStockAlert(e.target.checked)}
            style={{ width: "18px", height: "18px" }}
          />
          Mostrar advertencia de "Queda poco producto" en toda la app
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "0.5rem 0" }}>
          <input
            type="checkbox"
            checked={allowNegativeStock}
            onChange={(e) => setAllowNegativeStock(e.target.checked)}
            style={{ width: "18px", height: "18px" }}
          />
          Permitir stock negativo (no recomendado)
        </label>
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "-0.7rem" }}>
          Esta opción queda guardada, pero aplicarla en el trigger de stock es una mejora futura.
        </p>

        {saved && (
          <p style={{ color: "var(--color-success)", fontSize: "0.85rem" }}>
            ✅ Configuración guardada.
          </p>
        )}

        <Button onClick={handleSave} disabled={submitting} style={{ marginTop: "0.5rem" }}>
          {submitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}