import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import {
  CopilotConversationDetail,
  CopilotConversationSummary,
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

  getConversations(fleetId: string) {
    return this.http.get<CopilotConversationSummary[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/copilot/conversations`
    );
  }

  getConversation(
    fleetId: string,
    conversationId: string
  ) {
    return this.http.get<CopilotConversationDetail>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/copilot/conversations/${conversationId}`
    );
  }

  renameConversation(
    fleetId: string,
    conversationId: string,
    title: string
  ) {
    return this.http.patch<CopilotConversationSummary>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/copilot/conversations/${conversationId}`,
      { title }
    );
  }

  deleteConversation(
    fleetId: string,
    conversationId: string
  ) {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/copilot/conversations/${conversationId}`
    );
  }
}
