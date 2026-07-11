export interface VehicleSafetyScore {
  vehicleId: string;
  label: string;
  licensePlate: string;
  score: number;
  hardBrakes: number;
  hardAccelerations: number;
  harshTurns: number;
  speedingEvents: number;
  idleMinutes: number;
  checkEngine: boolean;
  milesDriven: number;
}
