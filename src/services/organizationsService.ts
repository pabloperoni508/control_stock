import { supabase } from "@/lib/supabase";
import { sanitizeTheme } from "@/lib/theme";
import { getOrgKind } from "@/config/modules";
import type { ActiveOrganization } from "@/types/organization";

export const organizationsService = {
  async getActiveForUser(userId: string): Promise<ActiveOrganization | null> {
    const { data: memberships, error: membershipError } = await supabase
      .from("organization_memberships")
      .select("organization_id, role, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (membershipError) throw membershipError;

    const membership = memberships?.[0];
    if (!membership) return null;

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, enabled_modules, theme")
      .eq("id", membership.organization_id)
      .single();
    if (orgError) throw orgError;

    const kind = getOrgKind(org.enabled_modules);
    if (!kind) {
      throw new Error("La organización no tiene módulos habilitados.");
    }

    return {
      id: org.id,
      name: org.name,
      role: membership.role,
      kind,
      theme: sanitizeTheme(org.theme),
    };
  },
};
