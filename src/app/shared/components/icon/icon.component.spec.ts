import { TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ declarations: [IconComponent] }));

  it('renders an inline svg for the requested icon', () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'delete');
    fixture.detectChanges();

    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    const path = svg.querySelector('path');
    expect(svg).toBeTruthy();
    expect(path?.getAttribute('d')).toBeTruthy();
  });

  it('renders a different path per icon name', () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'favorite');
    fixture.detectChanges();
    const favoritePath = fixture.nativeElement.querySelector('path').getAttribute('d');

    fixture.componentRef.setInput('name', 'favorite-outline');
    fixture.detectChanges();
    const outlinePath = fixture.nativeElement.querySelector('path').getAttribute('d');

    expect(favoritePath).not.toBe(outlinePath);
  });

  it('is hidden from assistive tech, since it is always used alongside a text label', () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'delete');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('svg').getAttribute('aria-hidden')).toBe('true');
  });
});
