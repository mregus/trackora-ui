import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {VehicleSafetyScore} from '../../shared/models/vehicle-safety.models';
import {FleetSafetyTrendPoint, SafetyInsight} from '../../shared/models/fleet-safety.models';

@Injectable({
  providedIn: 'root'
})
export class SafetyService {

  constructor(private http: HttpClient) {
  }

  getFleetSafetyScores(fleetId: string) {
    return this.http.get<VehicleSafetyScore[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/safety-scores`
    );
  }

  getFleetSafetyTrend(
    fleetId: string,
    days = 30
  ) {
    return this.http.get<FleetSafetyTrendPoint[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/safety-scores/trends`,
      {
        params: {
          days
        }
      }
    );
  }

  getSafetyInsight(fleetId: string) {
    return this.http.get<SafetyInsight>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/safety-scores/insights`
    );
  }
}
