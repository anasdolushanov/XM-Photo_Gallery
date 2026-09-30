import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from '../../shared.module';
import { HeaderComponent } from './header.component';

@Component({ template: '' })
class DummyComponent {}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes([
          { path: '', component: DummyComponent },
          { path: 'favorites', component: DummyComponent },
          { path: 'photos/:id', component: DummyComponent },
        ]),
      ],
      declarations: [DummyComponent],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    router = TestBed.inject(Router);
  });

  function links(): HTMLAnchorElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('a.header__link'));
  }

  function activeLabels(): string[] {
    return links()
      .filter(link => link.classList.contains('header__link--active'))
      .map(link => link.textContent!.trim());
  }

  function navigate(url: string): void {
    fixture.detectChanges();
    router.navigateByUrl(url);
    tick();
    fixture.detectChanges();
    // RouterLinkActive applies its classes asynchronously.
    tick();
  }

  it('renders Photos and Favorites links', () => {
    fixture.detectChanges();
    expect(links().map(l => l.textContent!.trim())).toEqual(['Photos', 'Favorites']);
    expect(links().map(l => l.getAttribute('href'))).toEqual(['/', '/favorites']);
  });

  it('highlights Photos on the root path', fakeAsync(() => {
    navigate('/');
    expect(activeLabels()).toEqual(['Photos']);
    expect(links()[0].getAttribute('aria-current')).toBe('page');
  }));

  it('highlights Favorites on /favorites', fakeAsync(() => {
    navigate('/favorites');
    expect(activeLabels()).toEqual(['Favorites']);
  }));
});
