export interface VehicleSearchResult {
  id: string;
  fleetId: string;
  label: string;
  vin?: string | null;
  licensePlate?: string | null;
  year: number;
  make: string;
  model: string;
}

export interface MaintenanceSearchResult {
  id: string;
  vehicleId: string;
  fleetId: string;
  label: string;
  serviceType: string;
  status: string;
  serviceDate: string;
}

export interface AlertSearchResult {
  id: string;
  fleetId: string;
  vehicleId?: string | null;
  label: string;
  type: string;
  severity: string;
  resolved: boolean;
  createdAt: string;
}

export interface SearchResponse {
  vehicles: VehicleSearchResult[];
  maintenance: MaintenanceSearchResult[];
  alerts: AlertSearchResult[];
}
