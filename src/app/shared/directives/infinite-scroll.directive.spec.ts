import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FakeIntersectionObserver } from '../../../testing/fake-intersection-observer';
import { InfiniteScrollDirective } from './infinite-scroll.directive';

@Component({
  template: `<div appInfiniteScroll [disabled]="disabled" rootMargin="50px" (scrolled)="count = count + 1"></div>`,
})
class HostComponent {
  disabled = false;
  count = 0;
}

describe('InfiniteScrollDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let observer: FakeIntersectionObserver;

  beforeEach(() => {
    FakeIntersectionObserver.install();
    TestBed.configureTestingModule({ declarations: [HostComponent, InfiniteScrollDirective] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    observer = FakeIntersectionObserver.latest();
  });

  afterEach(() => FakeIntersectionObserver.uninstall());

  it('observes the host element with the configured root margin', () => {
    const el = fixture.debugElement.query(By.directive(InfiniteScrollDirective)).nativeElement;
    expect(observer.observed.has(el)).toBeTrue();
    expect(observer.options?.rootMargin).toBe('50px');
  });

  it('emits when the sentinel enters the viewport', () => {
    observer.trigger(true);
    expect(host.count).toBe(1);
  });

  it('does not emit when the sentinel leaves the viewport', () => {
    observer.trigger(false);
    expect(host.count).toBe(0);
  });

  it('does not emit while disabled', () => {
    host.disabled = true;
    fixture.detectChanges();

    observer.trigger(true);
    expect(host.count).toBe(0);
  });

  it('re-checks the sentinel position when re-enabled', () => {
    host.disabled = true;
    fixture.detectChanges();
    const callsBefore = observer.observeCalls;

    host.disabled = false;
    fixture.detectChanges();

    expect(observer.observeCalls).toBe(callsBefore + 1);
    observer.trigger(true);
    expect(host.count).toBe(1);
  });

  it('disconnects the observer on destroy', () => {
    fixture.destroy();
    expect(observer.disconnected).toBeTrue();
  });
});
