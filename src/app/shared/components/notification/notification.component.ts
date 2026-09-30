import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { IconName } from '../icon/icon.component';

export type NotificationTone = 'success' | 'info' | 'error';

export interface NotificationData {
  message: string;
  icon: IconName;
  tone: NotificationTone;
}

/** Content of a toast opened by `NotificationService`: a tinted icon next to a centered message. */
@Component({
  selector: 'app-notification',
  template: `
    <div class="notification" [ngClass]="'notification--' + data.tone">
      <span class="notification__badge"><app-icon [name]="data.icon" class="notification__icon"></app-icon></span>
      <span class="notification__message">{{ data.message }}</span>
    </div>
  `,
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  readonly data = inject<NotificationData>(MAT_SNACK_BAR_DATA);
}
