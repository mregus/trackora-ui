export type FleetMemberRole = 'OWNER' | 'MANAGER' | 'VIEWER';

export interface FleetMember {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: FleetMemberRole;
  createdAt: string;
}

export interface AddFleetMemberRequest {
  email: string;
  role: FleetMemberRole;
}
