import { useCallback, useEffect, useState } from "react";
import { invitationsService } from "@/services/invitationsService";
import { teamService } from "@/services/teamService";
import type { PendingInvitation, TeamMember } from "@/types/team";
import { getErrorMessage } from "@/utils/errors";

export function useTeam(organizationId: string) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [memberRows, invitationRows] = await Promise.all([
        teamService.listMembers(organizationId),
        invitationsService.listPending(organizationId),
      ]);
      setMembers(memberRows);
      setInvitations(invitationRows);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar el equipo"));
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { members, invitations, loading, error, reload };
}
