import { FleetMemberRole } from './fleet-member.models';

export interface FleetInvitation {
  id: string;
  email: string;
  role: FleetMemberRole;
  accepted: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface CreateFleetInvitationRequest {
  email: string;
  role: FleetMemberRole;
}
