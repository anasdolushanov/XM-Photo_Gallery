import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Observable, defer, delay, of } from 'rxjs';

import { Photo } from '../models/photo.model';

export const PICSUM_BASE_URL = 'https://picsum.photos';
export const THUMBNAIL_SIZE = { width: 200, height: 300 };
/**
 * Widths of the full-size variants. They keep the thumbnail's 2:3 aspect ratio, so picsum
 * returns the same crop and the (already cached) thumbnail can stand in while they load.
 * The browser picks one from `srcset` based on rendered size and pixel density.
 */
export const FULL_SIZE_WIDTHS = [600, 1000] as const;
/**
 * Rendered width of the single photo: the page width, or the viewport height left under the
 * header and action row turned into a 2:3 width, whichever is smaller. Mirrors `.detail__frame`.
 */
export const FULL_SIZE_SIZES = 'min(calc(100vw - 32px), calc((100vh - 200px) * 2 / 3))';
export const MIN_DELAY_MS = 200;
export const MAX_DELAY_MS = 300;
export const DEFAULT_PAGE_SIZE = 12;

/**
 * Emulates a remote photo API backed by picsum.photos.
 * Every call returns a fresh batch of random photos after a random 200-300ms latency.
 */
@Injectable({ providedIn: 'root' })
export class PhotoService {
  private readonly document = inject(DOCUMENT);
  private readonly prefetched = new Set<string>();

  getRandomPhotos(count = DEFAULT_PAGE_SIZE): Observable<Photo[]> {
    // `defer` makes ids and latency get picked per subscription, like a real HTTP call.
    return defer(() => {
      const photos = Array.from({ length: count }, () => this.createPhoto(this.randomId()));
      return of(photos).pipe(delay(this.randomDelay()));
    });
  }

  getThumbnailUrl(id: string): string {
    return this.buildUrl(id, THUMBNAIL_SIZE.width, THUMBNAIL_SIZE.height);
  }

  /** Smallest full-size variant; the `src` fallback for browsers that ignore `srcset`. */
  getFullSizeUrl(id: string): string {
    return this.buildFullSizeUrl(id, FULL_SIZE_WIDTHS[0]);
  }

  getFullSizeSrcset(id: string): string {
    return FULL_SIZE_WIDTHS.map(width => `${this.buildFullSizeUrl(id, width)} ${width}w`).join(', ');
  }

  /**
   * Starts downloading the full-size variant the browser would pick for the single photo
   * page, so it is already cached (or on its way) when the page opens.
   */
  prefetchFullSize(id: string): void {
    if (this.prefetched.has(id)) {
      return;
    }
    this.prefetched.add(id);
    const image = this.document.createElement('img');
    image.decoding = 'async';
    image.sizes = FULL_SIZE_SIZES;
    image.srcset = this.getFullSizeSrcset(id);
    image.src = this.getFullSizeUrl(id);
  }

  private createPhoto(id: string): Photo {
    return { id, url: this.getThumbnailUrl(id) };
  }

  private buildFullSizeUrl(id: string, width: number): string {
    const height = Math.round((width * THUMBNAIL_SIZE.height) / THUMBNAIL_SIZE.width);
    return this.buildUrl(id, width, height);
  }

  private buildUrl(id: string, width: number, height: number): string {
    return `${PICSUM_BASE_URL}/seed/${encodeURIComponent(id)}/${width}/${height}`;
  }

  private randomId(): string {
    return Math.random().toString(36).slice(2, 12);
  }

  private randomDelay(): number {
    return MIN_DELAY_MS + Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1));
  }
}
