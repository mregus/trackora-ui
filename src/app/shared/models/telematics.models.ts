export interface TelematicsEvent {
  id: string;
  vehicleId: string;
  recordedAt: string;

  latitude: number | null;
  longitude: number | null;

  speedMph: number | null;
  odometerMiles: number | null;
  fuelLevelPercent: number | null;
  engineTempF: number | null;
  batteryVoltage: number | null;

  checkEngine: boolean;
  harshBraking: boolean;
  idleMinutes: number;
}
