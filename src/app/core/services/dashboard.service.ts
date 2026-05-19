import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DashboardSummary } from '../../shared/models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getSummary(fleetId: string): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/dashboard/summary`
    );
  }
}
