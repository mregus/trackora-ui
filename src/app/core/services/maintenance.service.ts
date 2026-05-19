import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateMaintenanceRequest,
  MaintenanceRecord,
  MaintenanceStatus
} from '../../shared/models/maintenance.models';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(private http: HttpClient) {}

  getVehicleMaintenance(vehicleId: string): Observable<MaintenanceRecord[]> {
    return this.http.get<MaintenanceRecord[]>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}/maintenance`
    );
  }

  createMaintenance(
    vehicleId: string,
    request: CreateMaintenanceRequest
  ): Observable<MaintenanceRecord> {
    return this.http.post<MaintenanceRecord>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}/maintenance`,
      request
    );
  }

  updateMaintenance(
    maintenanceId: string,
    request: CreateMaintenanceRequest & { status: MaintenanceStatus }
  ): Observable<MaintenanceRecord> {
    return this.http.put<MaintenanceRecord>(
      `${environment.apiBaseUrl}/maintenance/${maintenanceId}`,
      request
    );
  }
}
