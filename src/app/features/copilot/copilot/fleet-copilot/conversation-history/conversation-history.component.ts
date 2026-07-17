import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  CopilotConversationSummary
} from '../../../../../shared/models/fleet-copilot.models';

@Component({
  selector: 'app-conversation-history',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './conversation-history.component.html',
  styleUrl: './conversation-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationHistoryComponent {

  readonly conversations =
    input.required<CopilotConversationSummary[]>();

  readonly selectedConversationId =
    input<string | null>(null);

  readonly loading = input(false);

  readonly conversationSelected = output<string>();
  readonly newConversation = output<void>();

  readonly renameRequested =
    output<CopilotConversationSummary>();

  readonly deleteRequested =
    output<CopilotConversationSummary>();

  selectConversation(conversationId: string): void {
    this.conversationSelected.emit(conversationId);
  }

  startNewConversation(): void {
    this.newConversation.emit();
  }

  rename(
    event: MouseEvent,
    conversation: CopilotConversationSummary
  ): void {
    event.stopPropagation();
    this.renameRequested.emit(conversation);
  }

  delete(
    event: MouseEvent,
    conversation: CopilotConversationSummary
  ): void {
    event.stopPropagation();
    this.deleteRequested.emit(conversation);
  }
}
