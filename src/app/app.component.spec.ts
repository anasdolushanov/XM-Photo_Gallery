import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { FakeIntersectionObserver } from '../testing/fake-intersection-observer';
import { MemoryStorage } from '../testing/memory-storage';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { MAX_DELAY_MS } from './core/services/photo.service';
import { STORAGE } from './core/tokens/storage.token';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  beforeEach(() => {
    FakeIntersectionObserver.install();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), SharedModule, NoopAnimationsModule],
      declarations: [AppComponent],
      providers: [{ provide: STORAGE, useValue: new MemoryStorage() }],
    });
  });

  afterEach(() => FakeIntersectionObserver.uninstall());

  /** Navigates the real (lazy-loaded) routes and returns the rendered app. */
  async function renderAt(url: string): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.ngZone!.run(() => TestBed.inject(Router).navigateByUrl(url));
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  it('renders the header and a router outlet', async () => {
    const el = await renderAt('/favorites');

    expect(el.querySelector('app-header')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });

  it('shows the photo stream at /', async () => {
    const el = await renderAt('/');
    expect(el.querySelector('app-photos-page')).toBeTruthy();
  });

  it('renders photos once the emulated API responds', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await fixture.ngZone!.run(() => TestBed.inject(Router).navigateByUrl('/'));
    await new Promise(resolve => setTimeout(resolve, MAX_DELAY_MS + 50));
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.grid__image').length).toBeGreaterThan(0);
    expect(el.querySelector('app-loader')).toBeNull();
  });

  it('shows favorites at /favorites', async () => {
    const el = await renderAt('/favorites');
    expect(el.querySelector('app-favorites-page')).toBeTruthy();
  });

  it('shows a single photo at /photos/:id', async () => {
    const el = await renderAt('/photos/abc');
    expect(el.querySelector('app-photo-detail-page')).toBeTruthy();
  });

  it('redirects unknown urls to the photo stream', async () => {
    const el = await renderAt('/does/not/exist');

    expect(TestBed.inject(Location).path()).toBe('/');
    expect(el.querySelector('app-photos-page')).toBeTruthy();
  });
});
