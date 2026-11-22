import { supabase } from "@/lib/supabase";
import type { CreatedInvitation, PendingInvitation } from "@/types/team";

// Las invitaciones solo se manejan mediante funciones de la base (la tabla no
// admite acceso directo). Ellas validan que quien llama sea administrador.
export const invitationsService = {
  async listPending(organizationId: string): Promise<PendingInvitation[]> {
    const { data, error } = await supabase.rpc("list_org_invitations", {
      p_organization_id: organizationId,
    });
    if (error) throw error;
    return data ?? [];
  },

  /** El token vuelve una sola vez: hay que usarlo en el momento. */
  async create(
    organizationId: string,
    email: string,
    role: "admin" | "member"
  ): Promise<CreatedInvitation> {
    const { data, error } = await supabase.rpc("create_org_invitation", {
      p_organization_id: organizationId,
      p_email: email,
      p_role: role,
    });
    if (error) throw error;

    const created = data?.[0];
    if (!created) throw new Error("No se pudo crear la invitación");
    return created;
  },

  async revoke(invitationId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc("revoke_org_invitation", {
      p_invitation_id: invitationId,
    });
    if (error) throw error;
    return data === true;
  },

  /** Devuelve el id de la organización a la que se unió el usuario. */
  async accept(token: string): Promise<string> {
    const { data, error } = await supabase.rpc("accept_org_invitation", {
      p_token: token,
    });
    if (error) throw error;
    return data as string;
  },
};
