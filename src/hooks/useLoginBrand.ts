import { useState } from "react";
import { NEUTRAL_BRAND, brandLabel, readCachedBrand, type Brand } from "@/lib/brand";

/**
 * Marca para la pantalla de login: la del último ingreso en este dispositivo,
 * o una neutra si nunca se inició sesión. `label` junta emoji y nombre.
 */
export function useLoginBrand(): Brand & { label: string } {
  const [brand] = useState<Brand>(() => readCachedBrand() ?? NEUTRAL_BRAND);
  return { ...brand, label: brandLabel(brand) };
}
