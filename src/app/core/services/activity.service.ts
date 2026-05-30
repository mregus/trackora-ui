import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ActivityLog } from '../../shared/models/activity-log';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  getFleetActivity(fleetId: string) {
    return this.http.get<ActivityLog[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/activity`
    );
  }
}
