import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Vehicle,
  CreateVehicleRequest,
  VinDecodeResponse,
  DecodedVehicleInfo, UpdateVehicleRequest
} from '../../shared/models/vehicle.models';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) {}

  getFleetVehicles(fleetId: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/vehicles`
    );
  }

  getVehicle(vehicleId: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}`
    );
  }

  createVehicle(
    fleetId: string,
    request: CreateVehicleRequest
  ): Observable<Vehicle> {
    return this.http.post<Vehicle>(
      `${environment.apiBaseUrl}/fleets/${fleetId}/vehicles`,
      request
    );
  }

  decodeVin(vin: string) {
    return this.http
      .get<VinDecodeResponse>(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
      )
      .pipe(
        map(response => {
          const getValue = (variable: string): string => {
            return response.Results.find(r => r.Variable === variable)?.Value ?? '';
          };

          const errorCode = getValue('Error Code');

          if (errorCode && errorCode !== '0') {
            throw new Error(getValue('Error Text') || 'Invalid VIN');
          }

          return {
            vin,
            make: getValue('Make'),
            model: getValue('Model'),
            year: Number(getValue('Model Year'))
          } as DecodedVehicleInfo;
        })
      );
  }

  updateVehicle(
    vehicleId: string,
    request: UpdateVehicleRequest
  ): Observable<Vehicle> {
    return this.http.put<Vehicle>(
      `${environment.apiBaseUrl}/vehicles/${vehicleId}`,
      request
    );
  }
}
