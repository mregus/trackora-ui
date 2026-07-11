export interface FleetCopilotRequest {
  question: string;
}

export interface FleetCopilotResponse {
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
