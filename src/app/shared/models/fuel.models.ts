export interface FuelLog {
  id: string;
  vehicleId: string;
  fuelDate: string;
  mileage: number;
  gallons: number;
  totalCost: number;
  pricePerGallon: number;
  createdAt: string;
}

export interface CreateFuelLogRequest {
  fuelDate: string;
  mileage: number;
  gallons: number;
  totalCost: number;
  pricePerGallon: number;
}
