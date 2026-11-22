import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { invitationsService } from "@/services/invitationsService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  clearPendingInvitation,
  getPendingInvitation,
  savePendingInvitation,
} from "@/lib/pendingInvitation";
import { INVITATION_TOKEN_PATTERN } from "@/utils/invitations";
import { getErrorMessage } from "@/utils/errors";

const cardStyle = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  padding: "1.5rem",
  width: "100%",
  maxWidth: "440px",
};

function Shell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "1.3rem", marginTop: 0 }}>Invitación</h1>
        {children}
      </div>
    </div>
  );
}

function translateAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return "Email o contraseña incorrectos.";
  if (/email not confirmed/i.test(message)) return "Todavía no confirmaste tu email. Revisá tu correo.";
  if (/password should be at least/i.test(message)) return "La contraseña debe tener al menos 6 caracteres.";
  if (/signups not allowed/i.test(message)) return "El registro de cuentas nuevas no está habilitado.";
  return message;
}

function AuthForm({ token, initialEmail }: { token: string; initialEmail: string }) {
  const { signIn } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Ingresá tu email.");
      return;
    }
    if (mode === "signup") {
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (password !== confirm) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === "login") {
        await signIn(cleanEmail, password);
      } else {
        const redirectTo = `${window.location.origin}/invitacion?token=${token}&email=${encodeURIComponent(cleanEmail)}`;
        const data = await authService.signUp(cleanEmail, password, redirectTo);
        if (!data.session) {
          setNotice(
            `Te enviamos un email de confirmación a ${cleanEmail}. Abrilo y confirmá tu cuenta: vas a volver acá para aceptar la invitación. Si ya tenías cuenta con ese email, iniciá sesión en su lugar.`
          );
        }
      }
    } catch (err) {
      setError(translateAuthError(getErrorMessage(err, "No se pudo completar la operación")));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginTop: 0 }}>
        Te invitaron a unirte a una organización. Usá el <strong>mismo email al que llegó la invitación</strong>.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <Button
          type="button"
          variant={mode === "signup" ? "primary" : "secondary"}
          onClick={() => setMode("signup")}
          style={{ flex: 1 }}
        >
          Crear cuenta
        </Button>
        <Button
          type="button"
          variant={mode === "login" ? "primary" : "secondary"}
          onClick={() => setMode("login")}
          style={{ flex: 1 }}
        >
          Ya tengo cuenta
        </Button>
      </div>

      <Input
        id="accept-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <Input
        id="accept-password"
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
      />
      {mode === "signup" && (
        <Input
          id="accept-confirm"
          label="Confirmar contraseña"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />
      )}

      {error && <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>❌ {error}</p>}
      {notice && <p style={{ color: "var(--color-success)", fontSize: "0.85rem" }}>✅ {notice}</p>}

      <Button type="submit" disabled={busy} style={{ width: "100%" }}>
        {busy ? "Procesando..." : mode === "signup" ? "Crear cuenta" : "Iniciar sesión"}
      </Button>
    </form>
  );
}

export function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    user,
    loading,
    organization,
    organizationLoading,
    organizationError,
    retryOrganization,
    signOut,
  } = useAuth();

  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urlToken = searchParams.get("token");
  const urlTokenIsValid = urlToken !== null && INVITATION_TOKEN_PATTERN.test(urlToken);
  const token = urlTokenIsValid ? urlToken.toLowerCase() : getPendingInvitation();
  const emailFromLink = searchParams.get("email") ?? "";

  // Se guarda para que sobreviva al paso por el email de confirmación.
  useEffect(() => {
    if (urlTokenIsValid && urlToken) savePendingInvitation(urlToken.toLowerCase());
  }, [urlTokenIsValid, urlToken]);

  async function handleAccept() {
    if (!token || accepting) return;
    setAccepting(true);
    setError(null);
    try {
      await invitationsService.accept(token);
      clearPendingInvitation();
      retryOrganization();
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo aceptar la invitación"));
    } finally {
      setAccepting(false);
    }
  }

  if (!token) {
    return (
      <Shell>
        <p>El enlace de invitación no es válido.</p>
        <Button onClick={() => navigate("/")}>Ir al inicio</Button>
      </Shell>
    );
  }

  if (loading || organizationLoading) {
    return (
      <Shell>
        <p>Cargando...</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <AuthForm token={token} initialEmail={emailFromLink} />
      </Shell>
    );
  }

  if (organizationError) {
    return (
      <Shell>
        <p style={{ color: "var(--color-danger)" }}>❌ {organizationError}</p>
        <Button variant="secondary" onClick={retryOrganization}>
          Reintentar
        </Button>
      </Shell>
    );
  }

  if (organization) {
    return (
      <Shell>
        <p>
          Tu usuario ya pertenece a <strong>{organization.name}</strong>. Una cuenta solo puede estar en una
          organización, así que no podés aceptar esta invitación con este usuario.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button
            onClick={() => {
              clearPendingInvitation();
              navigate("/", { replace: true });
            }}
          >
            Ir a la aplicación
          </Button>
          <Button variant="secondary" onClick={() => void signOut()}>
            Usar otra cuenta
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <p>
        Iniciaste sesión como <strong>{user.email}</strong>. Aceptá la invitación para unirte a la organización.
      </p>

      {error && <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>❌ {error}</p>}

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Button onClick={() => void handleAccept()} disabled={accepting}>
          {accepting ? "Aceptando..." : "Aceptar invitación"}
        </Button>
        <Button variant="secondary" onClick={() => void signOut()}>
          Usar otra cuenta
        </Button>
      </div>
    </Shell>
  );
}
