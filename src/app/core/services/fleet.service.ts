import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Fleet } from '../../shared/models/fleet.models';

@Injectable({
  providedIn: 'root'
})
export class FleetService {

  constructor(private http: HttpClient) {}

  getMyFleets(): Observable<Fleet[]> {
    return this.http.get<Fleet[]>(
      `${environment.apiBaseUrl}/fleets`
    );
  }

  createFleet(name: string): Observable<Fleet> {
    return this.http.post<Fleet>(
      `${environment.apiBaseUrl}/fleets`,
      { name }
    );
  }
}
