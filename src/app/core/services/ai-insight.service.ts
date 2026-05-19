import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AiInsight,
  GenerateAiSummaryRequest
} from '../../shared/models/ai-insight.models';

@Injectable({
  providedIn: 'root'
})
export class AiInsightService {
  constructor(private http: HttpClient) {}

  getFleetInsights(fleetId: string): Observable<AiInsight[]> {
    return this.http.get<AiInsight[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/ai/insights`
    );
  }

  generateFleetSummary(
    fleetId: string,
    request: GenerateAiSummaryRequest
  ): Observable<AiInsight> {
    return this.http.post<AiInsight>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/ai/summary`,
      request
    );
  }

  getLatestVehicleInsight(vehicleId: string) {
    return this.http.get<AiInsight | null>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}/ai/insights/latest`
    );
  }

  getVehicleInsights(vehicleId: string) {
    return this.http.get<AiInsight[]>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}/ai/insights`
    );
  }

  generateVehicleSummary(
    vehicleId: string,
    request: GenerateAiSummaryRequest
  ) {
    return this.http.post<AiInsight>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}/ai/summary`,
      request
    );
  }
}
