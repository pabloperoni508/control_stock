import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { creditNotesService } from "@/services/creditNotesService";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/format";
import type { CreditNoteRecord } from "@/types/creditNote";

export function OrderCreditNotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<CreditNoteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const from = new Date();
    from.setDate(from.getDate() - 30);

    creditNotesService.getSince(from).then((data) => {
      setNotes(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate("/pedidos")}>
        ← Volver a hojas de pedido
      </Button>

      <h1>🧾 Notas de crédito</h1>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
        Pedidos cancelados en los últimos 30 días.
      </p>

      {loading && <p>Cargando...</p>}

      {!loading && notes.length === 0 && (
        <p style={{ color: "var(--color-text-muted)" }}>
          No hay notas de crédito en el último mes.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => navigate(`/pedidos/${note.order_id}`)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "0.9rem 1rem",
              cursor: "pointer",
            }}
          >
            <div>
              <strong>{note.customer_name || "Sin nombre"}</strong>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                {new Date(note.created_at).toLocaleString("es-AR")}
              </div>
            </div>
            <div style={{ fontWeight: 700, color: "var(--color-danger)" }}>
              {note.total !== null ? `-${formatCurrency(note.total)}` : "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}