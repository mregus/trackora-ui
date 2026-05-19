import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AlertContextService } from './core/services/alert-context.service';
import { FleetContextService } from './core/services/fleet-context.service';
import { AuthService } from './core/auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Alert } from './shared/models/alert.models';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fleetwise-ui');

  constructor(
    private authService: AuthService,
    private router: Router,
    public alertContextService: AlertContextService,
    private fleetContextService: FleetContextService
  ) {}

  ngOnInit(): void {
    const fleetId = this.fleetContextService.selectedFleetId();

    if (fleetId) {
      this.alertContextService.loadOpenAlertCount(fleetId);
    }
  }

  openAlert(alert: Alert): void {
    if (alert.vehicleId) {
      this.router.navigate(['/vehicles', alert.vehicleId]);
      return;
    }

    this.router.navigate(['/alerts']);
  }

  showShell(): boolean {
    return this.authService.isAuthenticated() && this.router.url !== '/login';
  }

  logout(): void {
    this.authService.logout();
    this.alertContextService.clear();
    this.router.navigate(['/login']);
  }
}
