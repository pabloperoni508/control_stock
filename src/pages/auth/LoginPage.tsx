import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from ?? "/";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al iniciar sesión");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg)",
        padding: "1rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--color-surface)",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth: "360px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
          🥜 Control Stock
        </h1>

        <label
          style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}
        >
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.6rem",
            marginBottom: "1rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
          }}
        />

        <label
          style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}
        >
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.6rem",
            marginBottom: "1rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
          }}
        />

        {error && (
          <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "0.7rem",
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontSize: "1rem",
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}