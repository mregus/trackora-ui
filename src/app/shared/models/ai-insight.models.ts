export interface AiInsight {
  id: string;
  fleetId: string;
  summary: string;
  createdAt: string;
}

export interface GenerateAiSummaryRequest {
  timeframe: string;
  includeFuelStats: boolean;
  includeMaintenanceStats: boolean;
}
