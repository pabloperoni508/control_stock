import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SettingsPage() {
  const { user, signOut } = useAuth();

  const [fullName, setFullName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setFullName(data.full_name);
      });
  }, [user]);

  async function handleSaveName() {
    if (!user) return;
    setSavingName(true);
    setNameSaved(false);
    try {
      await authService.updateFullName(user.id, fullName.trim());
      setNameSaved(true);
    } finally {
      setSavingName(false);
    }
  }

  async function handleChangePassword() {
    setPasswordError(null);
    setPasswordSaved(false);

    if (newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setSavingPassword(true);
    try {
      await authService.updatePassword(newPassword);
      setPasswordSaved(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Error al cambiar la contraseña"
      );
    } finally {
      setSavingPassword(false);
    }
  }

  const cardStyle = {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    padding: "1.5rem",
    maxWidth: "480px",
    marginBottom: "1.5rem",
  };

  return (
    <div>
      <h1>⚙️ Configuración</h1>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Perfil</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          Email: {user?.email}
        </p>

        <Input
          label="Nombre completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Tu nombre"
        />

        {nameSaved && (
          <p style={{ color: "var(--color-success)", fontSize: "0.85rem" }}>
            ✅ Nombre guardado.
          </p>
        )}

        <Button onClick={handleSaveName} disabled={savingName}>
          {savingName ? "Guardando..." : "Guardar nombre"}
        </Button>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Cambiar contraseña</h2>

        <Input
          label="Nueva contraseña"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirmar nueva contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {passwordError && (
          <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>
            ❌ {passwordError}
          </p>
        )}
        {passwordSaved && (
          <p style={{ color: "var(--color-success)", fontSize: "0.85rem" }}>
            ✅ Contraseña actualizada.
          </p>
        )}

        <Button onClick={handleChangePassword} disabled={savingPassword}>
          {savingPassword ? "Guardando..." : "Cambiar contraseña"}
        </Button>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Sesión</h2>
        <Button variant="danger" onClick={() => signOut()}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}