import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import {
  AppNotification,
  UnreadNotificationCount
} from '../../shared/models/notification.models';

@Injectable({
  providedIn: 'root'
})
export class AppNotificationService {
  notifications = signal<AppNotification[]>([]);
  unreadCount = signal(0);

  constructor(private http: HttpClient) {}

  loadNotifications(): void {
    this.http.get<AppNotification[]>(
      `${environment.apiBaseUrl}/notifications`
    ).subscribe({
      next: notifications => this.notifications.set(notifications)
    });
  }

  loadUnreadCount(): void {
    this.http.get<UnreadNotificationCount>(
      `${environment.apiBaseUrl}/notifications/unread-count`
    ).subscribe({
      next: response => this.unreadCount.set(response.count)
    });
  }

  refresh(): void {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  markAsRead(id: string): void {
    this.http.put<void>(
      `${environment.apiBaseUrl}/notifications/${id}/read`,
      {}
    ).subscribe({
      next: () => this.refresh()
    });
  }

  markAllAsRead(): void {
    this.http.put<void>(
      `${environment.apiBaseUrl}/notifications/read-all`,
      {}
    ).subscribe({
      next: () => this.refresh()
    });
  }
}
