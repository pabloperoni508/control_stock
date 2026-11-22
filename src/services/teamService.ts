import { supabase } from "@/lib/supabase";
import type { TeamMember } from "@/types/team";

export const teamService = {
  /**
   * Integrantes de la organización. Un administrador puede ver todas las
   * membresías de la suya (RLS). Si la política de perfiles no deja ver el nombre
   * o el email de alguien, igual se lista a la persona, sin esos datos.
   */
  async listMembers(organizationId: string): Promise<TeamMember[]> {
    const { data: memberships, error } = await supabase
      .from("organization_memberships")
      .select("user_id, role, created_at")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true });
    if (error) throw error;

    const rows = memberships ?? [];
    if (rows.length === 0) return [];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in(
        "id",
        rows.map((m) => m.user_id)
      );

    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

    return rows.map((m) => ({
      userId: m.user_id,
      role: m.role,
      fullName: byId.get(m.user_id)?.full_name ?? null,
      email: byId.get(m.user_id)?.email ?? null,
    }));
  },
};
