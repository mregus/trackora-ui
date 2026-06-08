import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { TelematicsEvent } from '../../shared/models/telematics.models';

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
}
