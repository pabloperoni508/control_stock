// Marca que se muestra en el login. Como antes de iniciar sesión no se sabe qué
// organización es, se recuerda en este dispositivo la del último ingreso.
export interface Brand {
  emoji: string;
  name: string;
}

export const STOCK_BRAND: Brand = { emoji: "🥜", name: "Control Stock" };
export const BAKERY_EMOJI = "🥖";
// Dispositivo que nunca inició sesión: sin nombre de ningún negocio.
export const NEUTRAL_BRAND: Brand = { emoji: "", name: "Iniciar sesión" };

const BRAND_CACHE_KEY = "app_brand";

export function brandFor(org: { kind: "stock" | "bakery"; name: string }): Brand {
  return org.kind === "bakery" ? { emoji: BAKERY_EMOJI, name: org.name } : STOCK_BRAND;
}

export function brandLabel(brand: Brand): string {
  return [brand.emoji, brand.name].filter(Boolean).join(" ");
}

/** Lee lo guardado con cuidado: si está dañado o raro, se ignora. */
export function parseBrand(raw: string | null): Brand | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as unknown;
    if (typeof value !== "object" || value === null) return null;
    const { emoji, name } = value as Record<string, unknown>;
    if (
      typeof emoji === "string" &&
      typeof name === "string" &&
      name.trim() !== "" &&
      name.length <= 80 &&
      emoji.length <= 8
    ) {
      return { emoji, name };
    }
  } catch {
    // JSON inválido: se ignora
  }
  return null;
}

export function readCachedBrand(): Brand | null {
  try {
    return parseBrand(localStorage.getItem(BRAND_CACHE_KEY));
  } catch {
    return null;
  }
}

export function cacheBrand(brand: Brand): void {
  try {
    localStorage.setItem(BRAND_CACHE_KEY, JSON.stringify(brand));
  } catch {
    // Sin almacenamiento: el login queda con la marca neutra.
  }
}
