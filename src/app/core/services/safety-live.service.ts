import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { VehicleSafetyScore } from '../../shared/models/vehicle-safety.models';

@Injectable({
  providedIn: 'root'
})
export class SafetyLiveService {
  private stompClient?: Client;
  private readonly scoresSubject =
    new Subject<VehicleSafetyScore[]>();

  stream(): Observable<VehicleSafetyScore[]> {
    return this.scoresSubject.asObservable();
  }

  connect(fleetId: string): void {
    if (this.stompClient?.active) {
      this.disconnect();
    }

    this.stompClient = new Client({
      brokerURL: environment.wsBaseUrl,
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      this.stompClient?.subscribe(
        `/topic/fleets/${fleetId}/safety`,
        message => {
          const scores =
            JSON.parse(message.body) as VehicleSafetyScore[];

          this.scoresSubject.next(scores);
        }
      );
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    this.stompClient?.deactivate();
    this.stompClient = undefined;
  }
}
