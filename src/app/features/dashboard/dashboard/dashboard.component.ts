import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { FleetService } from '../../../core/services/fleet.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Fleet } from '../../../shared/models/fleet.models';
import {
  DashboardSummary,
  FleetHealthBreakdown,
  FleetRecommendation
} from '../../../shared/models/dashboard.models';
import { FleetContextService } from '../../../core/services/fleet-context.service';
import { AiInsightService } from '../../../core/services/ai-insight.service';

import { VehicleService } from '../../../core/services/vehicle.service';
import { FuelService } from '../../../core/services/fuel.service';
import { MaintenanceService } from '../../../core/services/maintenance.service';

import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';
import {AlertContextService} from '../../../core/services/alert-context.service';
import {NotificationService} from '../../../core/services/notification.service';
import {AuthService} from '../../../core/auth/auth.service';
import {ActivityLogModels} from '../../../shared/models/activity-log.models';
import {ActivityService} from '../../activity/activity';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    BaseChartDirective,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  fleets = signal<Fleet[]>([]);
  selectedFleetId = signal<string | null>(null);
  summary = signal<DashboardSummary | null>(null);

  latestFleetInsight = signal<string | null>(null);
  olderFleetInsights = signal<any[]>([]);
  showOlderFleetInsights = signal(false);
  generatingFleetInsight = signal(false);
  loadingOlderFleetInsights = signal(false);

  activities = signal<ActivityLogModels[]>([]);

  recommendations = signal<FleetRecommendation[]>([]);

  private destroyRef = inject(DestroyRef);

  private readonly activityService = inject(ActivityService);

  constructor(
    private fleetService: FleetService,
    private dashboardService: DashboardService,
    private fleetContextService: FleetContextService,
    private aiInsightService: AiInsightService,
    private vehicleService: VehicleService,
    private fuelService: FuelService,
    private maintenanceService: MaintenanceService,
    private alertContextService: AlertContextService,
    private notificationService: NotificationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFleets();

    interval(30000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const fleetId = this.selectedFleetId();

        if (!fleetId) {
          return;
        }

        this.loadDashboardSummary(fleetId);
        this.loadLatestFleetInsight(fleetId);
        this.alertContextService.loadOpenAlertCount(fleetId);
      });
  }

  loadFleets(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.fleetService.getMyFleets().subscribe({
      next: fleets => {
        this.fleets.set(fleets);

        if (fleets.length === 0) {
          this.loading.set(false);
          this.errorMessage.set('No fleets found.');
          return;
        }

        const savedFleetId = this.fleetContextService.selectedFleetId();
        const selectedFleet =
          fleets.find(fleet => fleet.id === savedFleetId) ?? fleets[0];

        this.selectedFleetId.set(selectedFleet.id);
        this.fleetContextService.setSelectedFleetId(selectedFleet.id);
        this.loadDashboardSummary(selectedFleet.id);
      },
      error: err => {
        this.loading.set(false);
        // this.errorMessage.set('Unable to load fleets.');
        this.notificationService.error(err?.error?.message ?? 'Unable to load fleets.');
      }
    });
  }

  vehicleStatusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Active', 'In Shop', 'Out of Service'],
    datasets: [
      {
        data: [0, 0, 0]
      }
    ]
  };

  vehicleStatusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  fuelCostChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Fuel Cost',
        data: []
      }
    ]
  };

  maintenanceCostChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Maintenance Cost',
        data: []
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  onFleetChange(fleetId: string): void {
    this.selectedFleetId.set(fleetId);
    this.fleetContextService.setSelectedFleetId(fleetId);
    this.loading.set(true);
    this.summary.set(null);
    this.loadDashboardSummary(fleetId);
  }

  loadDashboardSummary(fleetId: string): void {
    this.dashboardService.getSummary(fleetId).subscribe({
      next: summary => {
        this.summary.set(summary);
        this.updateVehicleStatusChart(summary);
        this.loadFuelChart(fleetId);
        this.loadMaintenanceChart(fleetId);
        this.loadLatestFleetInsight(fleetId);

        this.activityService
          .getFleetActivity(fleetId)
          .subscribe({
            next: data => this.activities.set(data)
          });

        this.dashboardService
          .getRecommendations(fleetId)
          .subscribe({
          next: recommendations => this.recommendations.set(recommendations)
        });

        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        // this.errorMessage.set('Unable to load dashboard summary.');
        this.notificationService.error(err?.error?.message ?? 'Unable to load dashboard summary.');
      }
    });
  }

  loadLatestFleetInsight(fleetId: string): void {
    this.aiInsightService.getFleetInsights(fleetId).subscribe({
      next: insights => {
        this.latestFleetInsight.set(insights[0]?.summary ?? null);
      },
      error: err => {
        // this.errorMessage.set('Unable to load fleet AI insight.');
        this.notificationService.error(err?.error?.message ?? 'Unable to load fleet AI insight.');
      }
    });
  }

  generateFleetInsight(): void {
    const fleetId = this.selectedFleetId();

    if (!fleetId) {
      return;
    }

    this.generatingFleetInsight.set(true);
    this.errorMessage.set(null);

    this.aiInsightService.generateFleetSummary(fleetId, {
      timeframe: 'Last 30 days',
      includeFuelStats: true,
      includeMaintenanceStats: true
    }).subscribe({
      next: insight => {
        this.latestFleetInsight.set(insight.summary);
        this.olderFleetInsights.set([]);
        this.showOlderFleetInsights.set(false);
        this.generatingFleetInsight.set(false);
      },
      error: err => {
        this.generatingFleetInsight.set(false);
        // this.errorMessage.set('Unable to generate fleet AI insight.');
        this.notificationService.error(err?.error?.message ?? 'AI summary generation allowed once a day.');
      }
    });
  }

  loadOlderFleetInsights(): void {
    const fleetId = this.selectedFleetId();

    if (!fleetId) {
      return;
    }

    this.loadingOlderFleetInsights.set(true);

    this.aiInsightService.getFleetInsights(fleetId).subscribe({
      next: insights => {
        this.olderFleetInsights.set(insights.slice(1));
        this.showOlderFleetInsights.set(true);
        this.loadingOlderFleetInsights.set(false);
      },
      error: err => {
        this.loadingOlderFleetInsights.set(false);
        this.notificationService.error(err?.error?.message ?? 'Unable to load older fleet AI insights.');
      }
    });
  }

  getActivityIcon(action: string): string {
    switch (action) {
      case 'FLEET_CREATED':
        return 'business';

      case 'VEHICLE_CREATED':
      case 'VEHICLE_UPDATED':
        return 'directions_car';

      case 'MAINTENANCE_CREATED':
        return 'build';

      case 'MAINTENANCE_COMPLETED':
        return 'check_circle';

      case 'MAINTENANCE_CANCELLED':
        return 'cancel';

      case 'FUEL_LOG_CREATED':
        return 'local_gas_station';

      case 'ALERT_RESOLVED':
        return 'notifications_active';

      case 'DOCUMENT_UPLOADED':
        return 'description';

      case 'DOCUMENT_DELETED':
        return 'delete';

      case 'AI_SUMMARY_GENERATED':
        return 'psychology';

      default:
        return 'history';
    }
  }

  private updateVehicleStatusChart(summary: DashboardSummary): void {
    this.vehicleStatusChartData = {
      labels: ['Active', 'In Shop', 'Out of Service'],
      datasets: [
        {
          data: [
            summary.activeVehicles,
            summary.vehiclesInShop,
            summary.outOfServiceVehicles
          ],
          backgroundColor: [
            '#16a34a',
            '#f59e0b',
            '#dc2626'
          ]
        }
      ]
    };
  }

  private loadFuelChart(fleetId: string): void {
    this.fuelService.getFleetFuelLogs(fleetId).subscribe({
      next: logs => {
        const grouped = this.groupCostByDate(
          logs.map(log => ({
            date: log.fuelDate,
            cost: log.totalCost
          }))
        );

        this.fuelCostChartData = {
          labels: grouped.labels,
          datasets: [
            {
              label: 'Fuel Cost',
              data: grouped.values,
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.15)',
              tension: 0.35,
              fill: true
            }
          ]
        };
      }
    });
  }

  private loadMaintenanceChart(fleetId: string): void {
    this.vehicleService.getFleetVehicles(fleetId).subscribe({
      next: vehicles => {
        const allRecords: { date: string; cost: number }[] = [];

        let completed = 0;

        if (vehicles.length === 0) {
          this.maintenanceCostChartData = {
            labels: [],
            datasets: [{ label: 'Maintenance Cost', data: [] }]
          };
          return;
        }

        vehicles.forEach(vehicle => {
          this.maintenanceService.getVehicleMaintenance(vehicle.id).subscribe({
            next: records => {
              allRecords.push(
                ...records.map(record => ({
                  date: record.serviceDate,
                  cost: record.cost
                }))
              );

              completed++;

              if (completed === vehicles.length) {
                const grouped = this.groupCostByDate(allRecords);

                this.maintenanceCostChartData = {
                  labels: grouped.labels,
                  datasets: [
                    {
                      label: 'Maintenance Cost',
                      data: grouped.values,
                      borderColor: '#dc2626',
                      backgroundColor: 'rgba(220, 38, 38, 0.15)',
                      tension: 0.35,
                      fill: true
                    }
                  ]
                };
              }
            },
            error: () => {
              completed++;
            }
          });
        });
      }
    });
  }

  private groupCostByDate(items: { date: string; cost: number }[]): {
    labels: string[];
    values: number[];
  } {
    const grouped = new Map<string, number>();

    items.forEach(item => {
      const current = grouped.get(item.date) ?? 0;
      grouped.set(item.date, current + Number(item.cost));
    });

    const sorted = Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b));

    return {
      labels: sorted.map(([date]) => date),
      values: sorted.map(([, cost]) => Number(cost.toFixed(2)))
    };
  }

  private loadActivity(fleetId: string): void {
    this.activityService
      .getFleetActivity(fleetId)
      .subscribe({
        next: activities => this.activities.set(activities)
      });
  }

  getFleetHealthLabel(score: number): string {
    if (score >= 90) {
      return 'Excellent';
    }

    if (score >= 70) {
      return 'Good';
    }

    if (score >= 50) {
      return 'Needs Attention';
    }

    return 'Critical';
  }

  getFleetHealthClass(score: number): string {
    if (score >= 90) {
      return 'excellent';
    }

    if (score >= 70) {
      return 'good';
    }

    if (score >= 50) {
      return 'warning';
    }

    return 'critical';
  }

  getRecommendationIcon(type: string): string {
    switch (type) {
      case 'MAINTENANCE':
        return 'build';
      case 'ALERT':
        return 'warning';
      case 'HEALTH':
        return 'monitor_heart';
      default:
        return 'tips_and_updates';
    }
  }

  private loadDashboard(fleetId: string): void {
    this.loadDashboardSummary(fleetId);
    this.loadActivity(fleetId);
  }

  refresh(): void {
    const fleetId = this.selectedFleetId();

    if (!fleetId) {
      this.loadFleets();
      return;
    }

    this.loading.set(true);
    this.loadDashboardSummary(fleetId);
  }
}
