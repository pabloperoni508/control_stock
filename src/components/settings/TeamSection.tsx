import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTeam } from "@/hooks/useTeam";
import { invitationsService } from "@/services/invitationsService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { roleLabel } from "@/config/roles";
import {
  buildGmailComposeUrl,
  buildInvitationLink,
  buildInvitationMessage,
  buildMailtoUrl,
} from "@/utils/invitations";
import { getErrorMessage } from "@/utils/errors";

interface CreatedState {
  email: string;
  link: string;
  subject: string;
  body: string;
  expiresAt: string;
}

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const cardStyle = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  padding: "1.5rem",
  maxWidth: "560px",
  marginBottom: "1.5rem",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.75rem",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  padding: "0.6rem 0.8rem",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Se muestra solo a administradores de la panadería (lo decide quien lo usa).
export function TeamSection() {
  const { user, organization } = useAuth();
  const organizationId = organization?.id ?? "";
  const organizationName = organization?.name ?? "";
  const { members, invitations, loading, error, reload } = useTeam(organizationId);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedState | null>(null);
  const [copied, setCopied] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function createInvitation(targetEmail: string, targetRole: "admin" | "member") {
    const result = await invitationsService.create(organizationId, targetEmail, targetRole);
    const link = buildInvitationLink(window.location.origin, result.invitation_token, targetEmail);
    const message = buildInvitationMessage(organizationName, targetEmail, link, result.expires_at);
    setCreated({
      email: targetEmail,
      link,
      subject: message.subject,
      body: message.body,
      expiresAt: result.expires_at,
    });
    setCopied(false);
    await reload();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (creating) return;

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      setFormError("Ingresá un email válido.");
      return;
    }

    setCreating(true);
    setFormError(null);
    try {
      await createInvitation(cleanEmail, role);
      setEmail("");
    } catch (err) {
      setFormError(getErrorMessage(err, "No se pudo crear la invitación"));
    } finally {
      setCreating(false);
    }
  }

  async function handleRenew(invitationId: string, targetEmail: string, targetRole: string) {
    setBusyId(invitationId);
    setFormError(null);
    try {
      await createInvitation(targetEmail, targetRole === "admin" ? "admin" : "member");
    } catch (err) {
      setFormError(getErrorMessage(err, "No se pudo generar un nuevo enlace"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleRevoke(invitationId: string, targetEmail: string) {
    if (!window.confirm(`¿Revocar la invitación a ${targetEmail}? El enlace dejará de funcionar.`)) {
      return;
    }
    setBusyId(invitationId);
    setFormError(null);
    try {
      await invitationsService.revoke(invitationId);
      setCreated(null);
      await reload();
    } catch (err) {
      setFormError(getErrorMessage(err, "No se pudo revocar la invitación"));
    } finally {
      setBusyId(null);
    }
  }

  async function handleCopy() {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.link);
      setCopied(true);
    } catch {
      setCopied(false);
      setFormError("No se pudo copiar automáticamente. Seleccioná el enlace y copialo a mano.");
    }
  }

  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Equipo</h2>

      {loading && <p style={{ fontSize: "0.85rem" }}>Cargando equipo...</p>}
      {error && <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>❌ {error}</p>}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {members.map((member) => (
            <div key={member.userId} style={rowStyle}>
              <div style={{ minWidth: 0 }}>
                <strong style={{ fontSize: "0.9rem", overflowWrap: "anywhere" }}>
                  {member.fullName || member.email || "Usuario"}
                  {member.userId === user?.id ? " (vos)" : ""}
                </strong>
                {member.fullName && member.email && (
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", overflowWrap: "anywhere" }}>
                    {member.email}
                  </div>
                )}
              </div>
              <Badge variant={member.role === "admin" ? "success" : "neutral"}>
                {roleLabel(member.role)}
              </Badge>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.5rem" }}>Invitar a una persona</h3>
      <form onSubmit={handleSubmit}>
        <Input
          id="invite-email"
          label="Email (Gmail)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@gmail.com"
          autoComplete="off"
        />

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="invite-role"
            style={{
              display: "block",
              marginBottom: "0.3rem",
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
            }}
          >
            Rol
          </label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value === "admin" ? "admin" : "member")}
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              fontSize: "0.95rem",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text)",
            }}
          >
            <option value="member">Empleado: abre y cierra cajas y registra ventas</option>
            <option value="admin">Administrador: además reabre cajas e invita</option>
          </select>
        </div>

        {formError && (
          <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>❌ {formError}</p>
        )}

        <Button type="submit" disabled={creating}>
          {creating ? "Generando..." : "Generar invitación"}
        </Button>
      </form>

      {created && (
        <div
          style={{
            marginTop: "1.25rem",
            padding: "1rem",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <p style={{ margin: "0 0 0.5rem", fontWeight: 600 }}>
            ✅ Invitación para {created.email}
          </p>
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Vence el {formatDate(created.expiresAt)}. El enlace se muestra <strong>solo ahora</strong>:
            si lo perdés, generá uno nuevo.
          </p>

          {isLocal && (
            <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "var(--color-warning)" }}>
              ⚠️ Estás en localhost: este enlace solo funciona en tu computadora. Generalo desde la
              aplicación publicada para enviarlo.
            </p>
          )}

          <input
            readOnly
            value={created.link}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Enlace de invitación"
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              fontSize: "0.8rem",
            }}
          />

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button
              type="button"
              onClick={() =>
                window.open(
                  buildGmailComposeUrl(created.email, created.subject, created.body),
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              ✉️ Enviar por Gmail
            </Button>
            <Button type="button" variant="secondary" onClick={() => void handleCopy()}>
              {copied ? "✅ Copiado" : "📋 Copiar enlace"}
            </Button>
          </div>

          <p style={{ margin: "0.75rem 0 0", fontSize: "0.8rem" }}>
            <a href={buildMailtoUrl(created.email, created.subject, created.body)}>
              Usar la app de correo del dispositivo
            </a>
          </p>
        </div>
      )}

      {!loading && !error && invitations.length > 0 && (
        <>
          <h3 style={{ fontSize: "0.95rem", margin: "1.5rem 0 0.5rem" }}>Invitaciones pendientes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {invitations.map((invitation) => (
              <div key={invitation.invitation_id} style={{ ...rowStyle, flexWrap: "wrap" }}>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ fontSize: "0.9rem", overflowWrap: "anywhere" }}>
                    {invitation.email}
                  </strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    {roleLabel(invitation.role)} · vence el {formatDate(invitation.expires_at)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={busyId === invitation.invitation_id}
                    onClick={() =>
                      void handleRenew(invitation.invitation_id, invitation.email, invitation.role)
                    }
                    style={{ padding: "0.35rem 0.7rem", fontSize: "0.8rem" }}
                  >
                    Nuevo enlace
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    disabled={busyId === invitation.invitation_id}
                    onClick={() => void handleRevoke(invitation.invitation_id, invitation.email)}
                    style={{ padding: "0.35rem 0.7rem", fontSize: "0.8rem" }}
                  >
                    Revocar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
