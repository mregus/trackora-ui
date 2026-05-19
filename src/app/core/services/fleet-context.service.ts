import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FleetContextService {
  private readonly selectedFleetKey = 'fleetwise_selected_fleet_id';

  selectedFleetId = signal<string | null>(
    localStorage.getItem(this.selectedFleetKey)
  );

  setSelectedFleetId(fleetId: string): void {
    localStorage.setItem(this.selectedFleetKey, fleetId);
    this.selectedFleetId.set(fleetId);
  }

  clearSelectedFleetId(): void {
    localStorage.removeItem(this.selectedFleetKey);
    this.selectedFleetId.set(null);
  }
}
