export interface TeamMember {
  userId: string;
  role: string;
  fullName: string | null;
  email: string | null;
}

export interface PendingInvitation {
  invitation_id: string;
  email: string;
  role: string;
  invited_by: string;
  expires_at: string;
  created_at: string;
}

export interface CreatedInvitation {
  invitation_id: string;
  invitation_token: string;
  expires_at: string;
}
