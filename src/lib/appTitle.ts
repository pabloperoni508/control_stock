/**
 * Título de la pestaña del navegador.
 * - Con organización de panadería: su nombre.
 * - Con organización de stock: el título original de index.html.
 * - Sin organización (login, cierre de sesión): el último usado en este dispositivo.
 */
export function resolveTitle(
  organization: { kind: "stock" | "bakery"; name: string } | null,
  cachedTitle: string | null,
  defaultTitle: string
): string {
  if (organization) {
    return organization.kind === "bakery" ? organization.name : defaultTitle;
  }
  return cachedTitle ?? defaultTitle;
}
