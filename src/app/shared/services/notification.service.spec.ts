import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { NotificationComponent, NotificationData } from '../components/notification/notification.component';
import { NOTIFICATION_DURATION_MS, NOTIFICATION_PANEL_CLASS, NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['openFromComponent']);
    TestBed.configureTestingModule({ providers: [{ provide: MatSnackBar, useValue: snackBar }] });
    service = TestBed.inject(NotificationService);
  });

  function lastConfig(): MatSnackBarConfig<NotificationData> {
    const [component, config] = snackBar.openFromComponent.calls.mostRecent().args;
    expect(component).toBe(NotificationComponent);
    return config as MatSnackBarConfig<NotificationData>;
  }

  it('shows a centered toast at the bottom with the custom panel style', () => {
    service.success('Saved');

    const config = lastConfig();
    expect(config.horizontalPosition).toBe('center');
    expect(config.verticalPosition).toBe('bottom');
    expect(config.duration).toBe(NOTIFICATION_DURATION_MS);
    expect(config.panelClass).toBe(NOTIFICATION_PANEL_CLASS);
  });

  it('passes the message, icon and tone to the toast', () => {
    service.success('Added to favorites', 'favorite');
    expect(lastConfig().data).toEqual({ message: 'Added to favorites', icon: 'favorite', tone: 'success' });

    service.info('Removed from favorites', 'delete');
    expect(lastConfig().data).toEqual({ message: 'Removed from favorites', icon: 'delete', tone: 'info' });

    service.error('Something failed');
    expect(lastConfig().data).toEqual({ message: 'Something failed', icon: 'error', tone: 'error' });
  });

  it('uses a default icon per tone', () => {
    service.success('Done');
    expect(lastConfig().data?.icon).toBe('check');

    service.info('Note');
    expect(lastConfig().data?.icon).toBe('info');
  });
});
