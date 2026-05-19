import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateFuelLogRequest, FuelLog } from '../../shared/models/fuel.models';

@Injectable({
  providedIn: 'root'
})
export class FuelService {

  constructor(private http: HttpClient) {}

  getVehicleFuelLogs(vehicleId: string): Observable<FuelLog[]> {
    return this.http.get<FuelLog[]>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}/fuel-logs`
    );
  }

  getFleetFuelLogs(fleetId: string): Observable<FuelLog[]> {
    return this.http.get<FuelLog[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/fuel-logs`
    );
  }

  createFuelLog(
    vehicleId: string,
    request: CreateFuelLogRequest
  ): Observable<FuelLog> {
    return this.http.post<FuelLog>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}/fuel-logs`,
      request
    );
  }
}
