import { Injectable, computed, signal } from '@angular/core';
import { AlertService } from './alert.service';
import {Alert} from '../../shared/models/alert.models';

@Injectable({
  providedIn: 'root'
})
export class AlertContextService {
  private alertsCount = signal(0);
  openAlerts = signal<Alert[]>([]);

  openAlertCount = computed(() => this.alertsCount());

  constructor(private alertService: AlertService) {}

  loadOpenAlertCount(fleetId: string): void {
    this.alertService.getFleetAlerts(fleetId).subscribe({
      next: alerts => {
        const open = alerts.filter(alert => !alert.resolved);
        this.openAlerts.set(open);
        this.alertsCount.set(open.length);
      },
      error: () => {
        this.openAlerts.set([]);
        this.alertsCount.set(0);
      }
    });
  }

  clear(): void {
    this.openAlerts.set([]);
    this.alertsCount.set(0);
  }
}
