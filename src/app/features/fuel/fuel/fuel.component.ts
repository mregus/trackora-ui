import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { FleetService } from '../../../core/services/fleet.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { FuelService } from '../../../core/services/fuel.service';
import { FleetContextService } from '../../../core/services/fleet-context.service';

import { Fleet } from '../../../shared/models/fleet.models';
import { Vehicle } from '../../../shared/models/vehicle.models';
import { FuelLog } from '../../../shared/models/fuel.models';
import {NotificationService} from '../../../core/services/notification.service';

@Component({
  selector: 'app-fuel',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatPaginator,
    MatSnackBarModule
  ],
  templateUrl: './fuel.component.html',
  styleUrl: './fuel.component.css'
})
export class FuelComponent implements OnInit {
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal<string | null>(null);

  fleets = signal<Fleet[]>([]);
  vehicles = signal<Vehicle[]>([]);
  fuelLogs = signal<FuelLog[]>([]);

  selectedFleetId = signal<string | null>(null);
  selectedVehicleId = signal<string | null>(null);

  pageSize = signal(10);
  pageIndex = signal(0);

  displayedColumns = [
    'fuelDate',
    'mileage',
    'gallons',
    'totalCost',
    'pricePerGallon'
  ];

  form;

  constructor(
    private fb: FormBuilder,
    private fleetService: FleetService,
    private vehicleService: VehicleService,
    private fuelService: FuelService,
    private fleetContextService: FleetContextService,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.nonNullable.group({
      fuelDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
      mileage: [0, [Validators.required, Validators.min(0)]],
      gallons: [0, [Validators.required, Validators.min(0.01)]],
      totalCost: [0, [Validators.required, Validators.min(0.01)]],
      pricePerGallon: [0, [Validators.required, Validators.min(0.01)]]
    });

    this.form.controls.gallons.valueChanges.subscribe(() => this.calculatePricePerGallon());
    this.form.controls.totalCost.valueChanges.subscribe(() => this.calculatePricePerGallon());
  }

  ngOnInit(): void {
    this.loadFleets();
  }

  onPageChange(event: any): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  paginatedFuelLogs() {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.fuelLogs().slice(start, end);
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
        const selectedFleet = fleets.find(fleet => fleet.id === savedFleetId) ?? fleets[0];

        this.selectedFleetId.set(selectedFleet.id);
        this.fleetContextService.setSelectedFleetId(selectedFleet.id);

        this.loadVehicles(selectedFleet.id);
      },
      error: err => {
        this.loading.set(false);
        // this.errorMessage.set('Unable to load fleets.');
        this.notificationService.error(err?.error?.message ?? 'Unable to load fleets.');
      }
    });
  }

  onFleetChange(fleetId: string): void {
    this.selectedFleetId.set(fleetId);
    this.fleetContextService.setSelectedFleetId(fleetId);
    this.selectedVehicleId.set(null);
    this.fuelLogs.set([]);
    this.loadVehicles(fleetId);
  }

  loadVehicles(fleetId: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.vehicleService.getFleetVehicles(fleetId).subscribe({
      next: vehicles => {
        this.vehicles.set(vehicles);

        if (vehicles.length === 0) {
          this.loading.set(false);
          this.errorMessage.set('No vehicles found for this fleet.');
          return;
        }

        const firstVehicle = vehicles[0];
        this.selectedVehicleId.set(firstVehicle.id);
        this.patchMileage(firstVehicle);
        this.loadFuelLogs(firstVehicle.id);
      },
      error: err => {
        this.loading.set(false);
        // this.errorMessage.set('Unable to load vehicles.');
        this.notificationService.error(err?.error?.message ?? 'Unable to load vehicles.');
      }
    });
  }

  onVehicleChange(vehicleId: string): void {
    this.selectedVehicleId.set(vehicleId);

    const vehicle = this.vehicles().find(v => v.id === vehicleId);
    if (vehicle) {
      this.patchMileage(vehicle);
    }

    this.loadFuelLogs(vehicleId);
  }

  loadFuelLogs(vehicleId: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.fuelService.getVehicleFuelLogs(vehicleId).subscribe({
      next: logs => {
        this.fuelLogs.set(logs);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        // this.errorMessage.set('Unable to load fuel logs.');
        this.notificationService.error(err?.error?.message ?? 'Unable to load fuel logs.');
      }
    });
  }

  createFuelLog(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const vehicleId = this.selectedVehicleId();

    if (!vehicleId) {
      this.errorMessage.set('Select a vehicle before adding fuel.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    this.fuelService.createFuelLog(vehicleId, this.form.getRawValue()).subscribe({
      next: log => {
        this.fuelLogs.update(current => [log, ...current]);

        this.form.patchValue({
          fuelDate: new Date().toISOString().substring(0, 10),
          gallons: 0,
          totalCost: 0,
          pricePerGallon: 0
        });

        this.saving.set(false);
        this.notificationService.success('Fuel logs added successfully.');
      },
      error: err => {
        this.saving.set(false);
        // this.errorMessage.set('Unable to create fuel log.');
        this.notificationService.error(err?.error?.message ?? 'Unable to create fuel log.');
      }
    });
  }

  refresh(): void {
    const vehicleId = this.selectedVehicleId();

    if (!vehicleId) {
      const fleetId = this.selectedFleetId();
      if (fleetId) {
        this.loadVehicles(fleetId);
      }
      return;
    }

    this.loadFuelLogs(vehicleId);
  }

  private calculatePricePerGallon(): void {
    const gallons = this.form.controls.gallons.value;
    const totalCost = this.form.controls.totalCost.value;

    if (!gallons || gallons <= 0 || !totalCost || totalCost <= 0) {
      return;
    }

    const pricePerGallon = Number((totalCost / gallons).toFixed(3));

    this.form.patchValue(
      { pricePerGallon },
      { emitEvent: false }
    );
  }

  private patchMileage(vehicle: Vehicle): void {
    this.form.patchValue({
      mileage: vehicle.currentMileage ?? 0
    });
  }
}
