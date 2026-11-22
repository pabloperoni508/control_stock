export const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  member: "Empleado",
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
