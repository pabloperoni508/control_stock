// El token de invitación se guarda en esta pestaña para sobrevivir al paso por
// el email de confirmación de la cuenta (que vuelve a la app sin el enlace original).
const KEY = "pending_invitation_token";

export function savePendingInvitation(token: string): void {
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
    // Sin almacenamiento disponible: el enlace original sigue funcionando.
  }
}

export function getPendingInvitation(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearPendingInvitation(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // nada que limpiar
  }
}
