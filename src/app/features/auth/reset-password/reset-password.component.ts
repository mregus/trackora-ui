import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../core/auth/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  loading = signal(false);

  token = this.route.snapshot.queryParamMap.get('token') ?? '';

  form = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  submit(): void {
    if (!this.token) {
      this.notificationService.error('Invalid reset link.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    if (raw.newPassword !== raw.confirmPassword) {
      this.notificationService.error('Passwords do not match.');
      return;
    }

    this.loading.set(true);

    this.authService.resetPassword(this.token, raw.newPassword).subscribe({
      next: res => {
        this.loading.set(false);
        this.notificationService.success(res.message);
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading.set(false);
        this.notificationService.error(
          err?.error?.message ?? 'Unable to reset password.'
        );
      }
    });
  }
}
