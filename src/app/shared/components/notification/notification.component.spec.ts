import { TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { SharedModule } from '../../shared.module';
import { NotificationComponent, NotificationData } from './notification.component';

describe('NotificationComponent', () => {
  function render(data: NotificationData): HTMLElement {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: data }],
    });
    const fixture = TestBed.createComponent(NotificationComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('shows the message next to its icon', () => {
    const el = render({ message: 'Added to favorites', icon: 'favorite', tone: 'success' });

    expect(el.querySelector('.notification__message')?.textContent).toBe('Added to favorites');
    expect(el.querySelector('.notification__badge app-icon svg')).toBeTruthy();
  });

  it('applies the tone as a modifier class', () => {
    const el = render({ message: 'Oops', icon: 'error', tone: 'error' });

    expect(el.querySelector('.notification')?.classList).toContain('notification--error');
  });
});
