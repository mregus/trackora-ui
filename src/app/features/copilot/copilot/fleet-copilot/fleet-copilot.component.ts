import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FleetCopilotStateService } from '../../../../core/services/fleet-copilot-state.service';

@Component({
  selector: 'app-fleet-copilot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './fleet-copilot.component.html',
  styleUrl: './fleet-copilot.component.css'
})
export class FleetCopilotComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);

  readonly copilotState = inject(FleetCopilotStateService);

  @ViewChild('messagesContainer')
  private messagesContainer?: ElementRef<HTMLDivElement>;

  question = '';

  readonly suggestedQuestions = [
    'Which vehicle has the highest safety risk?',
    'How many vehicles are offline?',
    'What maintenance should I prioritize?',
    'What critical alerts need attention?',
    'How much are we spending on fuel and maintenance?'
  ];

  ngOnInit(): void {
    const fleetId = this.route.snapshot.paramMap.get('fleetId');

    if (!fleetId) {
      this.copilotState.errorMessage.set('Fleet ID is missing.');
      return;
    }

    this.copilotState.initialize(fleetId);
  }

  submit(): void {
    const question = this.question.trim();

    if (!question) {
      return;
    }

    this.copilotState.submitQuestion(question);
    this.question = '';
    this.scrollToBottom();
  }

  askSuggested(question: string): void {
    this.question = question;
    this.submit();
  }

  loadConversation(conversationId: string): void {
    this.copilotState.loadConversation(conversationId);
    this.scrollToBottom();
  }

  startNewConversation(): void {
    this.copilotState.startNewConversation();
    this.question = '';
  }

  renameConversation(
    conversationId: string,
    currentTitle: string
  ): void {
    const title = window.prompt(
      'Rename conversation',
      currentTitle
    );

    if (title?.trim()) {
      this.copilotState.renameConversation(
        conversationId,
        title
      );
    }
  }

  deleteConversation(conversationId: string): void {
    const confirmed = window.confirm(
      'Delete this conversation and all of its messages?'
    );

    if (confirmed) {
      this.copilotState.deleteConversation(conversationId);
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.messagesContainer?.nativeElement;

      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
