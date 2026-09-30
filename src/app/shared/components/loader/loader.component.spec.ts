import { TestBed } from '@angular/core/testing';

import { SharedModule } from '../../shared.module';
import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [SharedModule] }));

  it('shows a spinner with the default label', () => {
    const fixture = TestBed.createComponent(LoaderComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('mat-spinner')).toBeTruthy();
    expect(el.querySelector('[role="status"]')?.textContent).toContain('Loading...');
  });

  it('shows a custom label', () => {
    const fixture = TestBed.createComponent(LoaderComponent);
    fixture.componentRef.setInput('label', 'Fetching photos');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Fetching photos');
  });
});
