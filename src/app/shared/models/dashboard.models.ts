export interface DashboardSummary {
  fleetId: string;
  fleetName: string;

  totalVehicles: number;
  activeVehicles: number;
  vehiclesInShop: number;
  outOfServiceVehicles: number;

  openAlerts: number;

  monthlyMaintenanceCost: number;
  monthlyFuelCost: number;

  latestAiInsight: string | null;

  fleetHealthScore: number;
  fleetHealthBreakdown: FleetHealthBreakdown;

  onlineVehicles: number;
  staleVehicles: number;
  offlineVehicles: number;
  packetsToday: number;
  tripsToday: number;
}

export interface FleetHealthBreakdown {
  criticalAlerts: number;
  warningAlerts: number;
  overdueMaintenance: number;
  maintenanceDueSoon: number;
}

export interface FleetRecommendation {
  type: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | string;
}
