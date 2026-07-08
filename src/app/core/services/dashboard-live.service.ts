import {Observable, Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Client} from '@stomp/stompjs';
import {DashboardSummary} from '../../shared/models/dashboard.models';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardLiveService {
  private stompClient?: Client;
  private summary$ = new Subject<DashboardSummary>();

  stream(): Observable<DashboardSummary> {
    return this.summary$.asObservable();
  }

  connect(fleetId: string): void {
    if (this.stompClient?.active) {
      return;
    }

    this.stompClient = new Client({
      brokerURL: environment.wsBaseUrl,
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      this.stompClient?.subscribe(
        `/topic/fleets/${fleetId}/dashboard`,
        message => {
          this.summary$.next(JSON.parse(message.body));
        }
      );
    };

    this.stompClient.activate();
  }
}
