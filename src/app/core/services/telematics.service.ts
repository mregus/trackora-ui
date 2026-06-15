import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {TelematicsDevice, TelematicsEvent} from '../../shared/models/telematics.models';
import {FleetTelematicsLocation} from '../../shared/models/fleet-map.models';

@Injectable({
  providedIn: 'root'
})
export class TelematicsService {
  constructor(private http: HttpClient) {}

  getLatestForVehicle(vehicleId: string) {
    return this.http.get<TelematicsEvent>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}/telematics/latest`
    );
  }

  createEvent(event: Partial<TelematicsEvent> & { vehicleId: string }) {
    return this.http.post<TelematicsEvent>(
      `${environment.apiBaseUrl}/telematics/events`,
      event
    );
  }

  getDevicesForVehicle(vehicleId: string) {
    return this.http.get<TelematicsDevice[]>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}/telematics/devices`
    );
  }

  getFleetLocations(fleetId: string) {
    return this.http.get<FleetTelematicsLocation[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/telematics/latest`
    );
  }
}
