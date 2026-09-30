/**
 * Controllable stand-in for the browser IntersectionObserver, so tests can decide
 * exactly when an element "scrolls into view".
 */
export class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  private static original?: typeof IntersectionObserver;

  readonly observed = new Set<Element>();
  observeCalls = 0;
  disconnected = false;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    FakeIntersectionObserver.instances.push(this);
  }

  /** Replaces `window.IntersectionObserver` with this fake. */
  static install(): void {
    FakeIntersectionObserver.instances = [];
    FakeIntersectionObserver.original ??= window.IntersectionObserver;
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeIntersectionObserver;
  }

  static uninstall(): void {
    if (FakeIntersectionObserver.original) {
      window.IntersectionObserver = FakeIntersectionObserver.original;
    }
  }

  static latest(): FakeIntersectionObserver {
    return FakeIntersectionObserver.instances[FakeIntersectionObserver.instances.length - 1];
  }

  observe(el: Element): void {
    this.observed.add(el);
    this.observeCalls++;
  }

  unobserve(el: Element): void {
    this.observed.delete(el);
  }

  disconnect(): void {
    this.observed.clear();
    this.disconnected = true;
  }

  /** Reports every observed element as (not) intersecting the viewport. */
  trigger(isIntersecting: boolean): void {
    const entries = [...this.observed].map(target => ({ target, isIntersecting }) as IntersectionObserverEntry);
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}
