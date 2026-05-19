import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FleetService } from '../../../core/services/fleet.service';
import { FleetContextService } from '../../../core/services/fleet-context.service';
import { Fleet } from '../../../shared/models/fleet.models';
import {NotificationService} from '../../../core/services/notification.service';

@Component({
  selector: 'app-fleets',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './fleets.component.html',
  styleUrl: './fleets.component.css'
})
export class FleetsComponent implements OnInit {
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal<string | null>(null);

  fleets = signal<Fleet[]>([]);
  selectedFleetId;

  form;

  constructor(
    private fb: FormBuilder,
    private fleetService: FleetService,
    private fleetContextService: FleetContextService,
    private notificationService: NotificationService,
  ) {
    this.selectedFleetId = this.fleetContextService.selectedFleetId;

    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.loadFleets();
  }

  loadFleets(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.fleetService.getMyFleets().subscribe({
      next: fleets => {
        this.fleets.set(fleets);

        const savedFleetId = this.fleetContextService.selectedFleetId();
        const selectedFleet =
          fleets.find(fleet => fleet.id === savedFleetId) ?? fleets[0];

        if (selectedFleet) {
          this.fleetContextService.setSelectedFleetId(selectedFleet.id);
        }

        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.notificationService.error(err?.error?.message ?? 'Unable to load fleets.');
      }
    });
  }

  createFleet(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const name = this.form.getRawValue().name;

    this.fleetService.createFleet(name).subscribe({
      next: fleet => {
        this.fleets.update(current => [fleet, ...current]);
        this.fleetContextService.setSelectedFleetId(fleet.id);
        this.form.reset();
        this.saving.set(false);
      },
      error: err => {
        this.saving.set(false);
        this.notificationService.error(err?.error?.message ?? 'Unable to create fleets.');
      }
    });
  }

  selectFleet(fleetId: string): void {
    this.fleetContextService.setSelectedFleetId(fleetId);
  }

  isSelected(fleetId: string): boolean {
    return this.selectedFleetId() === fleetId;
  }
}
