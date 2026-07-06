import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DeadLetterMessage} from '../../shared/models/dead-letter-message.models';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceBusAdminService {
  private readonly http = inject(HttpClient);

  getDeadLetters(maxMessages = 20) {
    return this.http.get<DeadLetterMessage[]>(
      `${environment.apiBaseUrl}/admin/servicebus/deadletters`,
      {
        params: {
          maxMessages
        }
      }
    );
  }

  replayDeadLetter(messageId: string) {
    return this.http.post<{ message: string }>(
      `${environment.apiBaseUrl}/admin/servicebus/deadletters/${messageId}/replay`,
      {}
    );
  }

  deleteDeadLetter(messageId: string) {
    return this.http.delete<{ message: string }>(
      `${environment.apiBaseUrl}/admin/servicebus/deadletters/${messageId}`
    );
  }
}
