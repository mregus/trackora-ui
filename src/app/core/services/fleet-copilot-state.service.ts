import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { FleetCopilotService } from './fleet-copilot.service';
import {
  CopilotConversationSummary,
  CopilotMessage,
  FleetCopilotResponse
} from '../../shared/models/fleet-copilot.models';

@Injectable({
  providedIn: 'root'
})
export class FleetCopilotStateService {

  private readonly copilotService = inject(FleetCopilotService);

  readonly fleetId = signal('');
  readonly conversationId = signal<string | null>(null);

  readonly conversations = signal<CopilotConversationSummary[]>([]);
  readonly messages = signal<CopilotMessage[]>([]);

  readonly loadingConversations = signal(false);
  readonly loadingConversation = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  initialize(fleetId: string): void {
    this.fleetId.set(fleetId);
    this.resetMessages();
    this.loadConversations(true);
  }

  loadConversations(openMostRecent = false): void {
    const fleetId = this.fleetId();

    if (!fleetId) {
      return;
    }

    this.loadingConversations.set(true);
    this.errorMessage.set(null);

    this.copilotService
      .getConversations(fleetId)
      .pipe(
        finalize(() => this.loadingConversations.set(false))
      )
      .subscribe({
        next: conversations => {
          this.conversations.set(conversations);

          if (
            openMostRecent &&
            conversations.length > 0 &&
            !this.conversationId()
          ) {
            this.loadConversation(conversations[0].id);
          }
        },
        error: err => {
          this.errorMessage.set(
            err?.error?.message ?? 'Unable to load Copilot conversations.'
          );
        }
      });
  }

  loadConversation(conversationId: string): void {
    const fleetId = this.fleetId();

    if (!fleetId || this.loadingConversation()) {
      return;
    }

    this.loadingConversation.set(true);
    this.errorMessage.set(null);

    this.copilotService
      .getConversation(fleetId, conversationId)
      .pipe(
        finalize(() => this.loadingConversation.set(false))
      )
      .subscribe({
        next: conversation => {
          this.conversationId.set(conversation.id);

          this.messages.set(
            conversation.messages.map(message => ({
              role: message.role,
              text: message.content,
              supportingFacts: message.supportingFacts,
              generatedAt: message.createdAt,
              aiGenerated: message.aiGenerated
            }))
          );
        },
        error: err => {
          this.errorMessage.set(
            err?.error?.message ?? 'Unable to load the conversation.'
          );
        }
      });
  }

  submitQuestion(question: string): void {
    const fleetId = this.fleetId();
    const trimmedQuestion = question.trim();

    if (!fleetId || !trimmedQuestion || this.submitting()) {
      return;
    }

    const existingConversationId = this.conversationId();

    this.messages.update(current => [
      ...current,
      {
        role: 'USER',
        text: trimmedQuestion,
        generatedAt: new Date().toISOString()
      }
    ]);

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.copilotService
      .ask(fleetId, {
        question: trimmedQuestion,
        conversationId: existingConversationId
      })
      .pipe(
        finalize(() => this.submitting.set(false))
      )
      .subscribe({
        next: response => {
          this.handleAssistantResponse(response);

          const createdNewConversation =
            existingConversationId == null &&
            response.conversationId != null;

          this.conversationId.set(response.conversationId);

          if (createdNewConversation) {
            this.loadConversations();
          }
        },
        error: err => {
          this.messages.update(current =>
            current.filter((_, index) => index !== current.length - 1)
          );

          this.errorMessage.set(
            err?.error?.message ?? 'Unable to contact Fleet Copilot.'
          );
        }
      });
  }

  startNewConversation(): void {
    this.conversationId.set(null);
    this.errorMessage.set(null);
    this.resetMessages();
  }

  renameConversation(
    conversationId: string,
    title: string
  ): void {
    const fleetId = this.fleetId();
    const trimmedTitle = title.trim();

    if (!fleetId || !trimmedTitle) {
      return;
    }

    this.copilotService
      .renameConversation(fleetId, conversationId, trimmedTitle)
      .subscribe({
        next: updated => {
          this.conversations.update(current =>
            current.map(conversation =>
              conversation.id === updated.id
                ? updated
                : conversation
            )
          );
        },
        error: err => {
          this.errorMessage.set(
            err?.error?.message ?? 'Unable to rename the conversation.'
          );
        }
      });
  }

  deleteConversation(conversationId: string): void {
    const fleetId = this.fleetId();

    if (!fleetId) {
      return;
    }

    this.copilotService
      .deleteConversation(fleetId, conversationId)
      .subscribe({
        next: () => {
          this.conversations.update(current =>
            current.filter(
              conversation => conversation.id !== conversationId
            )
          );

          if (this.conversationId() === conversationId) {
            this.startNewConversation();
          }
        },
        error: err => {
          this.errorMessage.set(
            err?.error?.message ?? 'Unable to delete the conversation.'
          );
        }
      });
  }

  clearError(): void {
    this.errorMessage.set(null);
  }

  private handleAssistantResponse(
    response: FleetCopilotResponse
  ): void {
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
  }

  private resetMessages(): void {
    this.messages.set([
      {
        role: 'ASSISTANT',
        text: 'Ask me about fleet safety, device health, alerts, maintenance, or costs.',
        generatedAt: new Date().toISOString(),
        aiGenerated: false
      }
    ]);
  }
}
