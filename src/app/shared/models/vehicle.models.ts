export type VehicleStatus =
  | 'ACTIVE'
  | 'IN_SHOP'
  | 'OUT_OF_SERVICE'
  | 'SOLD';

export interface Vehicle {
  id: string;
  fleetId: string;

  vin: string;
  make: string;
  model: string;

  year: number;

  licensePlate: string;
  currentMileage: number;

  status: VehicleStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  vin?: string;

  make: string;
  model: string;

  year: number;

  licensePlate?: string;
  currentMileage?: number;
}

export interface VinDecodeResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: VinDecodeResult[];
}

export interface VinDecodeResult {
  Value: string | null;
  ValueId: string | null;
  Variable: string;
  VariableId: number;
}

export interface DecodedVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
}

export interface UpdateVehicleRequest {
  vin?: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  currentMileage?: number;
  status: VehicleStatus;
  fleetId: string;
}
