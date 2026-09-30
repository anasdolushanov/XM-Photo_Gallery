import { InjectionToken } from '@angular/core';

/**
 * Web Storage used to persist client-side state.
 * Injected (rather than using `localStorage` directly) so it can be swapped in tests.
 */
export const STORAGE = new InjectionToken<Storage>('STORAGE', {
  providedIn: 'root',
  factory: () => localStorage,
});
