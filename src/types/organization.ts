export type OrgKind = "stock" | "bakery";
export type OrgRole = "admin" | "member";

export type ThemeToken =
  | "primary"
  | "primaryDark"
  | "primaryContrast"
  | "background"
  | "surface"
  | "border"
  | "text"
  | "textMuted";

export type OrgTheme = Partial<Record<ThemeToken, string>>;

export interface ActiveOrganization {
  id: string;
  name: string;
  role: OrgRole;
  kind: OrgKind;
  theme: OrgTheme;
}
