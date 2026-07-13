export interface FleetCopilotRequest {
  question: string;
  conversationId?: string | null;
}

export interface FleetCopilotResponse {
  conversationId: string;
  answer: string;
  supportingFacts: string[];
  generatedAt: string;
  aiGenerated: boolean;
}

export interface CopilotMessage {
  role: 'USER' | 'ASSISTANT';
  text: string;
  supportingFacts?: string[];
  generatedAt: string;
  aiGenerated?: boolean;
}

export interface CopilotConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CopilotConversationDetail {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: CopilotStoredMessage[];
}

export interface CopilotStoredMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  supportingFacts: string[];
  aiGenerated: boolean;
  createdAt: string;
}
