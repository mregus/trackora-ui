export type MaintenanceStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export type ServiceType =
  | 'OIL_CHANGE'
  | 'BRAKES'
  | 'TIRES'
  | 'BATTERY'
  | 'TRANSMISSION'
  | 'INSPECTION'
  | 'REPAIR'
  | 'OTHER';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  serviceType: ServiceType;
  description?: string;
  serviceDate: string;
  mileage: number;
  cost: number;
  vendor?: string;
  nextServiceDate?: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRequest {
  serviceType: ServiceType;
  description?: string;
  serviceDate: string;
  mileage: number;
  cost: number;
  vendor?: string;
  nextServiceDate?: string;
}
