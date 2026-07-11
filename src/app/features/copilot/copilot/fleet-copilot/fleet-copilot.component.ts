import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {FleetCopilotService} from '../../../../core/services/fleet-copilot.service';
import {CopilotMessage} from '../../../../shared/models/fleet-copilot.models';

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
  private readonly copilotService = inject(FleetCopilotService);

  @ViewChild('messagesContainer')
  private messagesContainer?: ElementRef<HTMLDivElement>;

  fleetId = '';
  question = '';

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  messages = signal<CopilotMessage[]>([
    {
      role: 'ASSISTANT',
      text: 'Ask me about fleet safety, device health, alerts, maintenance, or costs.',
      generatedAt: new Date().toISOString(),
      aiGenerated: false
    }
  ]);

  suggestedQuestions = [
    'Which vehicle has the highest safety risk?',
    'How many vehicles are offline?',
    'What maintenance should I prioritize?',
    'What critical alerts need attention?',
    'How much are we spending on fuel and maintenance?'
  ];

  ngOnInit(): void {
    const fleetId = this.route.snapshot.paramMap.get('fleetId');

    if (!fleetId) {
      this.errorMessage.set('Fleet ID is missing.');
      return;
    }

    this.fleetId = fleetId;
  }

  submit(): void {
    const question = this.question.trim();

    if (!question || !this.fleetId || this.loading()) {
      return;
    }

    this.messages.update(current => [
      ...current,
      {
        role: 'USER',
        text: question,
        generatedAt: new Date().toISOString()
      }
    ]);

    this.question = '';
    this.loading.set(true);
    this.errorMessage.set(null);
    this.scrollToBottom();

    this.copilotService.ask(this.fleetId, { question }).subscribe({
      next: response => {
        this.messages.update(current => [
          ...current,
          {
            role: 'ASSISTANT',
            text: response.answer,
            supportingFacts: response.supportingFacts,
            generatedAt: response.generatedAt,
            aiGenerated: response.aiGenerated
          }
        ]);

        this.loading.set(false);
        this.scrollToBottom();
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Unable to contact Fleet Copilot.'
        );
      }
    });
  }

  askSuggested(question: string): void {
    this.question = question;
    this.submit();
  }

  clearConversation(): void {
    this.messages.set([
      {
        role: 'ASSISTANT',
        text: 'Conversation cleared. What would you like to know about this fleet?',
        generatedAt: new Date().toISOString(),
        aiGenerated: false
      }
    ]);
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
