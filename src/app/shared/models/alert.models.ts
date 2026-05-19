export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface Alert {
  id: string;
  fleetId: string;
  vehicleId?: string | null;
  type: string;
  severity: AlertSeverity;
  message: string;
  resolved: boolean;
  createdAt: string;
  resolvedAt?: string | null;
}
