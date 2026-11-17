import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { applyTheme } from "@/lib/theme";

export function ThemeSync() {
  const { organization } = useAuth();
  const theme = organization?.theme;

  useEffect(() => {
    applyTheme(theme ?? {});
  }, [theme]);

  return null;
}
