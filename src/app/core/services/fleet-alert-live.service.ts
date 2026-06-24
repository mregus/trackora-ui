import {Client} from '@stomp/stompjs';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {LiveAlertEvent} from '../../shared/models/telematics.models';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FleetAlertLiveService {

  private stompClient?: Client;
  private alerts$ = new Subject<LiveAlertEvent>();

  stream(): Observable<LiveAlertEvent> {
    return this.alerts$.asObservable();
  }

  connect(fleetId: string): void {

    if (this.stompClient?.active) {
      return;
    }

    this.stompClient = new Client({
      brokerURL: this.getWebSocketUrl(),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {

      this.stompClient?.subscribe(
        `/topic/fleets/${fleetId}/alerts`,
        message => {
          this.alerts$.next(
            JSON.parse(message.body)
          );
        }
      );
    };

    this.stompClient.activate();
  }

  private getWebSocketUrl(): string {
    return environment.wsBaseUrl;
  }
}
