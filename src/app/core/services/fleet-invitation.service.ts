import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {
  CreateFleetInvitationRequest,
  FleetInvitation
} from '../../shared/models/fleet-invitation.models';

@Injectable({
  providedIn: 'root'
})
export class FleetInvitationService {
  constructor(private http: HttpClient) {}

  getInvitations(fleetId: string) {
    return this.http.get<FleetInvitation[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/invitations`
    );
  }

  createInvitation(fleetId: string, request: CreateFleetInvitationRequest) {
    return this.http.post<FleetInvitation>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/invitations`,
      request
    );
  }

  resendInvitation(fleetId: string, invitationId: string) {
    return this.http.post<FleetInvitation>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/invitations/${invitationId}/resend`,
      {}
    );
  }

  cancelInvitation(fleetId: string, invitationId: string) {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/invitations/${invitationId}`
    );
  }
}
