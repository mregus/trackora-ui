import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'vehicles/:vehicleId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/vehicles/vehicle-details/vehicle-details.component')
        .then(m => m.VehicleDetailsComponent)
  },
  {
    path: 'vehicles',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/vehicles/vehicles/vehicles.component')
        .then(m => m.VehiclesComponent)
  },
  {
    path: 'fleets',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/fleets/fleets/fleets.component')
        .then(m => m.FleetsComponent)
  },
  {
    path: 'maintenance',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/maintenance/maintenance/maintenance.component')
        .then(m => m.MaintenanceComponent)
  },
  {
    path: 'fuel',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/fuel/fuel/fuel.component')
        .then(m => m.FuelComponent)
  },
  {
    path: 'alerts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/alerts/alerts/alerts.component')
        .then(m => m.AlertsComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
