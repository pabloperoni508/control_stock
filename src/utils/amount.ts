/**
 * Convierte lo que escribe el usuario en un importe válido.
 * Acepta coma o punto como separador decimal, hasta 2 decimales.
 * Devuelve null si no es un número mayor a cero.
 */
export function parseAmount(text: string): number | null {
  const normalized = text.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return value > 0 ? value : null;
}

/** Como formatCurrency, pero muestra los centavos cuando existen. */
export function formatAmount(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
