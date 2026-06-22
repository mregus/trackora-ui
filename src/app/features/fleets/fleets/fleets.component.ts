import {Component, inject, OnInit, signal} from '@angular/core';
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
import {FleetMember, FleetMemberRole} from '../../../shared/models/fleet-member.models';
import {FleetMemberService} from '../../../core/services/fleet-member.service';
import {MatOption, MatSelect} from '@angular/material/select';
import {FleetInvitation} from '../../../shared/models/fleet-invitation.models';
import {FleetInvitationService} from '../../../core/services/fleet-invitation.service';
import {RouterLink} from '@angular/router';
import {FleetLiveLocationService} from '../../../core/services/fleet-live-location.service';

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
    MatSnackBarModule,
    MatSelect,
    MatOption,
    RouterLink
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

  members = signal<FleetMember[]>([]);
  memberEmail = signal('');
  memberRole = signal<FleetMemberRole>('VIEWER');
  loadingMembers = signal(false);
  invitations = signal<FleetInvitation[]>([]);

  private readonly liveLocationService = inject(FleetLiveLocationService);

  constructor(
    private fb: FormBuilder,
    private fleetService: FleetService,
    private fleetContextService: FleetContextService,
    private notificationService: NotificationService,
    private fleetMemberService: FleetMemberService,
    private fleetInvitationService: FleetInvitationService
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
          this.loadMembers(selectedFleet.id);
          this.loadInvitations(selectedFleet.id);
          this.fleetContextService.setSelectedFleetId(selectedFleet.id);
        }

        // this.loadMembers(selectedFleet.id);
        // this.loadInvitations(selectedFleet.id);

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
    this.loadMembers(fleetId);
    this.fleetContextService.setSelectedFleetId(fleetId);
  }

  isSelected(fleetId: string): boolean {
    return this.selectedFleetId() === fleetId;
  }

  loadMembers(fleetId: string): void {
    this.loadingMembers.set(true);

    this.fleetMemberService.getMembers(fleetId).subscribe({
      next: members => {
        this.members.set(members);
        this.loadingMembers.set(false);
      },
      error: () => {
        this.loadingMembers.set(false);
        this.notificationService.error('Unable to load fleet members.');
      }
    });
  }

  addMember(): void {
    const fleetId = this.selectedFleetId();

    if (!fleetId) {
      this.notificationService.error('No fleet selected.');
      return;
    }

    const email = this.memberEmail().trim();

    if (!email) {
      this.notificationService.error('Email is required.');
      return;
    }

    this.fleetMemberService.addMember(fleetId, {
      email,
      role: this.memberRole()
    }).subscribe({
      next: () => {
        this.notificationService.success('Fleet member added.');
        this.memberEmail.set('');
        this.memberRole.set('VIEWER');
        this.loadMembers(fleetId);
      },
      error: err => {
        this.notificationService.error(
          err?.error?.message ?? 'Unable to add fleet member.'
        );
      }
    });
  }

  removeMember(memberId: string): void {
    const fleetId = this.selectedFleetId();

    if (!fleetId) {
      this.notificationService.error('No fleet selected.');
      return;
    }

    this.fleetMemberService.removeMember(fleetId, memberId).subscribe({
      next: () => {
        this.notificationService.success('Fleet member removed.');
        this.loadMembers(fleetId);
      },
      error: err => {
        this.notificationService.error(
          err?.error?.message ?? 'Unable to remove fleet member.'
        );
      }
    });
  }

  loadInvitations(fleetId: string): void {
    this.fleetInvitationService.getInvitations(fleetId).subscribe({
      next: invitations => this.invitations.set(invitations),
      error: () => this.notificationService.error('Unable to load invitations.')
    });
  }

  inviteMember(): void {
    const fleetId = this.selectedFleetId();

    if (!fleetId) {
      this.notificationService.error('No fleet selected.');
      return;
    }

    const email = this.memberEmail().trim();

    if (!email) {
      this.notificationService.error('Email is required.');
      return;
    }

    this.fleetInvitationService.createInvitation(fleetId, {
      email,
      role: this.memberRole()
    }).subscribe({
      next: () => {
        this.notificationService.success('Invitation sent.');
        this.memberEmail.set('');
        this.memberRole.set('VIEWER');
        this.loadInvitations(fleetId);
      },
      error: err => {
        this.notificationService.error(
          err?.error?.message ?? 'Unable to send invitation.'
        );
      }
    });
  }

  resendInvitation(invitationId: string): void {
    const fleetId = this.selectedFleetId();

    if (!fleetId) {
      return;
    }

    this.fleetInvitationService.resendInvitation(fleetId, invitationId).subscribe({
      next: () => this.notificationService.success('Invitation resent.'),
      error: err => {
        this.notificationService.error(
          err?.error?.message ?? 'Unable to resend invitation.'
        );
      }
    });
  }

  cancelInvitation(invitationId: string): void {
    const fleetId = this.selectedFleetId();

    if (!fleetId) {
      return;
    }

    this.fleetInvitationService.cancelInvitation(fleetId, invitationId).subscribe({
      next: () => {
        this.notificationService.success('Invitation cancelled.');
        this.loadInvitations(fleetId);
      },
      error: err => {
        this.notificationService.error(
          err?.error?.message ?? 'Unable to cancel invitation.'
        );
      }
    });
  }
}
