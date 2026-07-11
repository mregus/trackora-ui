import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute} from '@angular/router';
import {VehicleSafetyScore} from '../../../../shared/models/vehicle-safety.models';
import {SafetyService} from '../../../../core/services/safety-service';
import {Subject, takeUntil} from 'rxjs';
import {SafetyLiveService} from '../../../../core/services/safety-live.service';
import {ChartData, ChartOptions} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {SafetyInsight} from '../../../../shared/models/fleet-safety.models';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-safety-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './safety-dashboard.component.html',
  styleUrl: './safety-dashboard.component.css'
})
export class SafetyDashboardComponent implements OnInit, OnDestroy {
  fleetId = '';
  private readonly route = inject(ActivatedRoute);
  private readonly safetyService = inject(SafetyService);
  private readonly safetyLiveService = inject(SafetyLiveService);
  private readonly destroy$ = new Subject<void>();

  scores = signal<VehicleSafetyScore[]>([]);

  safetyInsight = signal<SafetyInsight | null>(null);
  loadingInsight = signal(false);

  fleetScore = computed(() => {
    const items = this.scores();
    if (items.length === 0) return 0;
    return Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);
  });

  safetyTrendData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Fleet Safety Score',
        data: [],
        tension: .35,
        fill: true
      }
    ]
  };

  safetyTrendOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  ngOnInit(): void {
    const fleetId = this.route.snapshot.paramMap.get('fleetId');

    if (!fleetId) {
      return;
    }

    this.fleetId = fleetId;

    this.safetyService
      .getFleetSafetyScores(fleetId)
      .subscribe(scores => this.scores.set(scores));

    this.loadTrend(fleetId);
    this.loadSafetyInsight(fleetId);

    this.safetyLiveService.connect(fleetId);

    this.safetyLiveService
      .stream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(scores => {
        this.scores.set(scores);

        // Refresh the explanation whenever scores change.
        this.loadSafetyInsight(fleetId);
        this.loadTrend(fleetId);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.safetyLiveService.disconnect();
  }

  scoreClass(score: number): string {
    if (score >= 85) return 'good';
    if (score >= 70) return 'warning';
    return 'danger';
  }

  safeVehicles = computed(() =>
    this.scores().filter(item => item.score >= 75).length
  );

  riskVehicles = computed(() =>
    this.scores().filter(item => item.score < 75).length
  );

  totalHardBrakes = computed(() =>
    this.scores().reduce((sum, item) => sum + item.hardBrakes, 0)
  );

  totalIdleMinutes = computed(() =>
    this.scores().reduce((sum, item) => sum + item.idleMinutes, 0)
  );

  scoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    return 'At Risk';
  }

  loadTrend(fleetId: string): void {

    this.safetyService
      .getFleetSafetyTrend(fleetId)
      .subscribe(points => {

        this.safetyTrendData = {

          labels: points.map(p =>
            new Date(p.date).toLocaleDateString()
          ),

          datasets: [

            {
              label: 'Fleet Safety',

              data: points.map(p => p.averageScore),

              tension: .4,

              fill: true
            }

          ]

        };

      });
  }

  loadSafetyInsight(fleetId: string): void {
    this.loadingInsight.set(true);

    this.safetyService.getSafetyInsight(fleetId).subscribe({
      next: insight => {
        this.safetyInsight.set(insight);
        this.loadingInsight.set(false);
      },
      error: err => {
        console.error('Unable to load safety insight', err);
        this.loadingInsight.set(false);
      }
    });
  }
}
