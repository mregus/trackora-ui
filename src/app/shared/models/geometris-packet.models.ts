export interface GeometrisRawPacket {
  id: string;
  serialNumber: string | null;
  reasonText: string | null;
  parsedSuccessfully: boolean;
  errorMessage: string | null;
  receivedAt: string;
}
