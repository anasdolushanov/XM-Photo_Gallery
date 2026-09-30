import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { IconName } from '../components/icon/icon.component';
import { NotificationComponent, NotificationData } from '../components/notification/notification.component';

export const NOTIFICATION_DURATION_MS = 2500;
/** Global class on the snack-bar container; styled in `styles.scss` since it renders in the overlay. */
export const NOTIFICATION_PANEL_CLASS = 'app-notification-panel';

/** Short, non-blocking toasts at the bottom center of the screen. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string, icon: IconName = 'check'): MatSnackBarRef<NotificationComponent> {
    return this.show({ message, icon, tone: 'success' });
  }

  info(message: string, icon: IconName = 'info'): MatSnackBarRef<NotificationComponent> {
    return this.show({ message, icon, tone: 'info' });
  }

  error(message: string): MatSnackBarRef<NotificationComponent> {
    return this.show({ message, icon: 'error', tone: 'error' });
  }

  private show(data: NotificationData): MatSnackBarRef<NotificationComponent> {
    // Opening a new toast replaces the current one, so rapid clicks never stack up.
    return this.snackBar.openFromComponent(NotificationComponent, {
      data,
      duration: NOTIFICATION_DURATION_MS,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: NOTIFICATION_PANEL_CLASS,
    });
  }
}
