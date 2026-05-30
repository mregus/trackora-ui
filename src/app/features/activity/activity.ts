import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {ActivityLogModels} from '../../shared/models/activity-log.models';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private readonly http = inject(HttpClient);

  getFleetActivity(fleetId: string) {
    return this.http.get<ActivityLogModels[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/activity`
    );
  }
}
