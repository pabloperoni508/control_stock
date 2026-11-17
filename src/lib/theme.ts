import type { OrgTheme, ThemeToken } from "@/types/organization";

const TOKEN_TO_CSS_VAR: Record<ThemeToken, string> = {
  primary: "--color-primary",
  primaryDark: "--color-primary-dark",
  primaryContrast: "--color-primary-contrast",
  background: "--color-bg",
  surface: "--color-surface",
  border: "--color-border",
  text: "--color-text",
  textMuted: "--color-text-muted",
};

const TOKENS = Object.keys(TOKEN_TO_CSS_VAR) as ThemeToken[];
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function sanitizeTheme(raw: unknown): OrgTheme {
  const theme: OrgTheme = {};
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return theme;
  }
  const source = raw as Record<string, unknown>;
  for (const token of TOKENS) {
    const value = source[token];
    if (typeof value === "string" && HEX_COLOR.test(value)) {
      theme[token] = value.toLowerCase();
    }
  }
  return theme;
}

function darken(hex: string, amount = 0.2): string {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number) =>
    Math.round(((n >> shift) & 255) * (1 - amount));
  return (
    "#" +
    [16, 8, 0].map((s) => channel(s).toString(16).padStart(2, "0")).join("")
  );
}

export function applyTheme(theme: OrgTheme): void {
  const style = document.documentElement.style;

  for (const cssVar of Object.values(TOKEN_TO_CSS_VAR)) {
    style.removeProperty(cssVar);
  }
  for (const token of TOKENS) {
    const value = theme[token];
    if (value) style.setProperty(TOKEN_TO_CSS_VAR[token], value);
  }
  if (theme.primary && !theme.primaryDark) {
    style.setProperty("--color-primary-dark", darken(theme.primary));
  }
}
