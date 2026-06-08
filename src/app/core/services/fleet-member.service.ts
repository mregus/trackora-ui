import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {
  AddFleetMemberRequest,
  FleetMember
} from '../../shared/models/fleet-member.models';

@Injectable({
  providedIn: 'root'
})
export class FleetMemberService {
  constructor(private http: HttpClient) {}

  getMembers(fleetId: string) {
    return this.http.get<FleetMember[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/members`
    );
  }

  addMember(fleetId: string, request: AddFleetMemberRequest) {
    return this.http.post<FleetMember>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/members`,
      request
    );
  }

  removeMember(fleetId: string, memberId: string) {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/members/${memberId}`
    );
  }
}
