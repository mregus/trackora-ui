import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ServiceBusAdminService } from '../../../../core/services/service-bus-admin.service';
import { DeadLetterMessage } from '../../../../shared/models/dead-letter-message.models';

@Component({
  selector: 'app-servicebus-deadletters',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './servicebus-deadletters.component.html',
  styleUrl: './servicebus-deadletters.component.css'
})
export class ServicebusDeadlettersComponent implements OnInit {
  private readonly serviceBusAdminService = inject(ServiceBusAdminService);

  loading = signal(false);
  messages = signal<DeadLetterMessage[]>([]);
  selected = signal<DeadLetterMessage | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    this.serviceBusAdminService.getDeadLetters(50).subscribe({
      next: messages => {
        this.messages.set(messages);
        this.loading.set(false);
      },
      error: err => {
        console.error('Unable to load DLQ messages', err);
        this.loading.set(false);
      }
    });
  }

  select(message: DeadLetterMessage): void {
    this.selected.set(message);
  }

  isJson(message: DeadLetterMessage): boolean {
    return message.body.trim().startsWith('{');
  }

  bodyPreview(message: DeadLetterMessage): string {
    return message.body.length > 120
      ? message.body.substring(0, 120) + '...'
      : message.body;
  }

  replay(message: DeadLetterMessage): void {
    this.serviceBusAdminService.replayDeadLetter(message.messageId).subscribe({
      next: () => this.load(),
      error: err => console.error('Unable to replay DLQ message', err)
    });
  }

  delete(message: DeadLetterMessage): void {
    this.serviceBusAdminService.deleteDeadLetter(message.messageId).subscribe({
      next: () => {
        if (this.selected()?.messageId === message.messageId) {
          this.selected.set(null);
        }

        this.load();
      },
      error: err => console.error('Unable to delete DLQ message', err)
    });
  }
}
