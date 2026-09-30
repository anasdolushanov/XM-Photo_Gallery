import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

/**
 * Emits `scrolled` when the host element (a "sentinel" placed after a list)
 * comes within `rootMargin` of the viewport.
 *
 * While `disabled` is true (e.g. a page is loading) no events are emitted. When it
 * switches back to false the sentinel is re-observed: IntersectionObserver then reports
 * its position after the next layout, so if the new content still doesn't fill the
 * screen another page is requested, until it does.
 */
@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements OnInit, OnChanges, OnDestroy {
  @Input() disabled = false;
  /** How close to the viewport the sentinel must get before loading more. */
  @Input() rootMargin = '200px';
  @Output() readonly scrolled = new EventEmitter<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      entries => {
        if (!this.disabled && entries.some(entry => entry.isIntersecting)) {
          // IntersectionObserver callbacks may run outside Angular; re-enter so bindings update.
          this.zone.run(() => this.scrolled.emit());
        }
      },
      { rootMargin: this.rootMargin },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const disabledChange = changes['disabled'];
    if (this.observer && disabledChange && !this.disabled) {
      this.observer.unobserve(this.host.nativeElement);
      this.observer.observe(this.host.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
