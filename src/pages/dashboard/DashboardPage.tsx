import { useEffect, useState } from "react";
import { unitsService } from "@/services/unitsService";
import { categoriesService } from "@/services/categoriesService";
import type { Unit, Category } from "@/types/product";

export function DashboardPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [unitsData, categoriesData] = await Promise.all([
          unitsService.getAll(),
          categoriesService.getAll(),
        ]);
        setUnits(unitsData);
        setCategories(categoriesData);
        setStatus("ok");
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <h1>Fase 4: modelo de productos</h1>

      {status === "loading" && <p>Cargando datos...</p>}

      {status === "error" && (
        <p style={{ color: "var(--color-danger)" }}>❌ Error: {errorMsg}</p>
      )}

      {status === "ok" && (
        <>
          <section style={{ marginBottom: "2rem" }}>
            <h2>Unidades ({units.length})</h2>
            <ul>
              {units.map((unit) => (
                <li key={unit.id}>
                  {unit.name} ({unit.abbreviation}) — tipo: {unit.type}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Categorías ({categories.length})</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}