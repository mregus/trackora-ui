export interface ActivityLogModels {
  id: string;
  fleetId: string;
  vehicleId: string | null;
  userId: string;

  action: string;

  entityType: string;
  entityId: string | null;

  message: string;

  createdAt: string;
}
