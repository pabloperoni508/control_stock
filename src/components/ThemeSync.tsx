import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { applyTheme } from "@/lib/theme";
import { resolveTitle } from "@/lib/appTitle";
import { brandFor, cacheBrand } from "@/lib/brand";

const TITLE_CACHE_KEY = "app_title";

// Título original de index.html. Se guarda una sola vez en el elemento <html>
// para que no se pierda si el módulo se vuelve a cargar con el título ya cambiado.
function getDefaultTitle(): string {
  const root = document.documentElement;
  if (!root.dataset.defaultTitle) root.dataset.defaultTitle = document.title;
  return root.dataset.defaultTitle;
}

function readCachedTitle(): string | null {
  try {
    return localStorage.getItem(TITLE_CACHE_KEY);
  } catch {
    return null;
  }
}

function cacheTitle(title: string): void {
  try {
    localStorage.setItem(TITLE_CACHE_KEY, title);
  } catch {
    // Sin almacenamiento: el título se resuelve igual al iniciar sesión.
  }
}

/**
 * Aplica el tema, el título de la pestaña y recuerda la marca de la organización
 * activa (para el login). Al cerrar sesión se restauran los colores y quedan el
 * último título y la última marca usados en el dispositivo.
 */
export function ThemeSync() {
  const { organization } = useAuth();
  const theme = organization?.theme;
  const kind = organization?.kind ?? null;
  const name = organization?.name ?? null;

  useEffect(() => {
    applyTheme(theme ?? {});
  }, [theme]);

  useEffect(() => {
    const title = resolveTitle(
      kind && name ? { kind, name } : null,
      readCachedTitle(),
      getDefaultTitle()
    );
    document.title = title;
    if (kind && name) {
      cacheTitle(title);
      cacheBrand(brandFor({ kind, name }));
    }
  }, [kind, name]);

  return null;
}
