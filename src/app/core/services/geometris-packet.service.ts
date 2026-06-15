import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { GeometrisRawPacket } from '../../shared/models/geometris-packet.models';

@Injectable({
  providedIn: 'root'
})
export class GeometrisPacketService {
  constructor(private http: HttpClient) {}

  getLatestPackets() {
    return this.http.get<GeometrisRawPacket[]>(
      `${environment.apiBaseUrl}/telematics/providers/geometris/raw-packets`
    );
  }

  getFailedPackets() {
    return this.http.get<GeometrisRawPacket[]>(
      `${environment.apiBaseUrl}/telematics/providers/geometris/raw-packets/failed`
    );
  }
}
