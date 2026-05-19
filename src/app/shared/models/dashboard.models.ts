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

  latestAiInsight: string;
}
