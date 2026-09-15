import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function App() {
  const [status, setStatus] = useState<"loading" | "blocked" | "unexpected-success" | "unexpected-error">("loading");
  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    async function testRLS() {
      const { error } = await supabase
        .from("categories")
        .insert({ name: "test-rls-sin-sesion" });

      if (error) {
        setStatus("blocked");
        setDetail(error.message);
      } else {
        setStatus("unexpected-success");
      }
    }

    testRLS();
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🥜 Control Stock — App</h1>
      <p>Fase 2: prueba estricta de RLS (intento de escritura sin sesión)</p>

      {status === "loading" && <p>Probando...</p>}
      {status === "blocked" && (
        <div style={{ color: "green" }}>
          <p>✅ RLS está funcionando correctamente.</p>
          <p style={{ fontSize: "0.85rem", color: "#555" }}>Detalle: {detail}</p>
        </div>
      )}
      {status === "unexpected-success" && (
        <p style={{ color: "red" }}>
          ❌ Se insertó una fila sin sesión. Esto SÍ es un problema real de RLS.
        </p>
      )}
    </div>
  );
}

export default App;