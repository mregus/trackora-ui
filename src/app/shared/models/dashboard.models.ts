import {DestroyRef, inject} from '@angular/core';

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

  fleetHealthScore: number;
  fleetHealthBreakdown: FleetHealthBreakdown;
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
