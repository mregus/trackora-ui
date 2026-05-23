import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {NotificationService} from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const notifications = inject(NotificationService);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      switch (error.status) {

        case 400:
          notifications.error(
            error.error?.message || 'Invalid request.'
          );
          break;

        case 401:
          notifications.error(
            'Authentication required. Please log in again.'
          );
          break;

        case 403:
          notifications.error(
            'You do not have permission to perform this action.'
          );
          break;

        case 404:
          notifications.error(
            'Requested resource was not found.'
          );
          break;

        case 500:
          notifications.error(
            error.error?.message || 'Unexpected server error.'
          );
          break;

        default:
          notifications.error(
            'Something went wrong.'
          );
      }

      return throwError(() => error);
    })
  );
};
