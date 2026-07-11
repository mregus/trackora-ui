export interface FleetSafetyTrendPoint {
  date: string;
  averageScore: number;
  hardBrakes: number;
  hardAccelerations: number;
  harshTurns: number;
  speedingEvents: number;
  idleMinutes: number;
}

export interface SafetyInsight {
  summary: string;
  recommendations: string[];
  generatedAt: string;
}
