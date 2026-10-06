import { useEffect, useState } from "react";
import { unitsService, type UnitInsert } from "@/services/unitsService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Unit } from "@/types/product";

const typeLabels: Record<Unit["type"], string> = {
  weight: "Peso",
  count: "Cantidad",
  volume: "Volumen",
};

export function UnitsManager() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [type, setType] = useState<Unit["type"]>("weight");
  const [conversionFactor, setConversionFactor] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    unitsService.getAll().then((data) => {
      setUnits(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    if (!name.trim() || !abbreviation.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: UnitInsert = {
        name: name.trim(),
        abbreviation: abbreviation.trim(),
        type,
        conversion_factor: Number(conversionFactor) || 1,
      };
      await unitsService.create(payload);
      setName("");
      setAbbreviation("");
      setConversionFactor("1");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la unidad");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(unit: Unit) {
    const confirmed = window.confirm(
      `¿Borrar la unidad "${unit.name}"? Esto fallará si algún producto o pedido la está usando.`
    );
    if (!confirmed) return;
    try {
      await unitsService.delete(unit.id);
      load();
    } catch (err) {
      alert(
        "No se pudo borrar: probablemente hay productos o pedidos que usan esta unidad. Desactivá o cambiá esos productos primero."
      );
    }
  }

  const selectStyle = {
    padding: "0.6rem",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--color-border)",
  };

  return (
    <div>
      <h2 style={{ fontSize: "1rem" }}>Unidades de medida</h2>
      <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Ej: "Tarro" con factor 150 equivale a 150 gramos (mismo tipo "Peso" que Gramo/Kilogramo).
      </p>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {units.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0.8rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.85rem",
              }}
            >
              <span>
                {u.name} ({u.abbreviation}) — {typeLabels[u.type]}, factor {u.conversion_factor}
              </span>
              <button
                onClick={() => handleDelete(u)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-danger)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
                aria-label="Borrar"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
          padding: "1rem",
          backgroundColor: "var(--color-bg)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <div style={{ width: "140px" }}>
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 0 }} />
        </div>
        <div style={{ width: "100px" }}>
          <Input
            label="Abreviatura"
            value={abbreviation}
            onChange={(e) => setAbbreviation(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
        <div style={{ width: "130px" }}>
          <label style={{ display: "block", fontSize: "0.8rem", marginBottom: "0.3rem" }}>Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value as Unit["type"])} style={selectStyle}>
            <option value="weight">Peso</option>
            <option value="count">Cantidad</option>
            <option value="volume">Volumen</option>
          </select>
        </div>
        <div style={{ width: "110px" }}>
          <Input
            label="Factor"
            type="number"
            min={0.0001}
            step="0.0001"
            value={conversionFactor}
            onChange={(e) => setConversionFactor(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
        <Button onClick={handleCreate} disabled={submitting}>
          + Agregar
        </Button>
      </div>

      {error && (
        <p style={{ color: "var(--color-danger)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          ❌ {error}
        </p>
      )}
    </div>
  );
}