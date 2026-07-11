import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import {
  FleetCopilotRequest,
  FleetCopilotResponse
} from '../../shared/models/fleet-copilot.models';

@Injectable({
  providedIn: 'root'
})
export class FleetCopilotService {

  private readonly http = inject(HttpClient);

  ask(
    fleetId: string,
    request: FleetCopilotRequest
  ) {
    return this.http.post<FleetCopilotResponse>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/copilot/ask`,
      request
    );
  }
}
