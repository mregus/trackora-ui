export interface FleetTelematicsLocation {
  vehicleId: string;
  label: string;
  licensePlate: string;
  latitude: number;
  longitude: number;
  speedMph: number | null;
  fuelLevelPercent: number | null;
  checkEngine: boolean;
  headingDegrees: number | null;
  recordedAt: string;
}
