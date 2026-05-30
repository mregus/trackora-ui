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
import {ThemeService} from './core/services/theme.service';

import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

import { SearchService } from './core/services/search.service';
import { SearchResponse } from './shared/models/search.models';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fleetwise-ui');

  searchQuery = '';
  searchResults: SearchResponse | null = null;
  searchOpen = false;

  private searchTerms = new Subject<string>();

  constructor(
    private authService: AuthService,
    private router: Router,
    public alertContextService: AlertContextService,
    private fleetContextService: FleetContextService,
    public themeService: ThemeService,
    private searchService: SearchService,
  ) {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.searchService.search(query))
    ).subscribe(results => {
      this.searchResults = results;
      this.searchOpen = true;
    });
  }

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

  onSearchChange(query: string): void {
    this.searchQuery = query;

    if (query.trim().length < 2) {
      this.searchResults = null;
      this.searchOpen = false;
      return;
    }

    this.searchTerms.next(query.trim());
  }

  openVehicle(vehicleId: string): void {
    this.searchOpen = false;
    this.searchQuery = '';
    this.searchResults = null;

    this.router.navigate(['/vehicles', vehicleId]);
  }

  openSearchAlert(): void {
    this.searchOpen = false;
    this.searchQuery = '';
    this.searchResults = null;

    this.router.navigate(['/alerts']);
  }
}
