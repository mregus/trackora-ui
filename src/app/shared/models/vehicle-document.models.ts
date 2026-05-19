export interface VehicleDocument {
  id: string;
  vehicleId: string;
  originalFileName: string;
  contentType?: string;
  fileSize: number;
  documentType?: string;
  createdAt: string;
}
