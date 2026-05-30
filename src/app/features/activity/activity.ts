import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {ActivityLog} from '../../shared/models/activity-log';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private readonly http = inject(HttpClient);

  getFleetActivity(fleetId: string) {
    return this.http.get<ActivityLog[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/activity`
    );
  }
}
