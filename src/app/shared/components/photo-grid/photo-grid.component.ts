import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Photo } from '../../../core/models/photo.model';

/**
 * Responsive grid of photo thumbnails. Purely presentational: it reports clicks
 * and leaves what a click means (add to favorites, open details...) to the parent.
 */
@Component({
  selector: 'app-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrls: ['./photo-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGridComponent {
  @Input() photos: readonly Photo[] = [];
  /** Ids of photos to mark with a favorite badge. */
  @Input() favoriteIds: ReadonlySet<string> = new Set();
  /** Accessible description of what clicking a photo does. */
  @Input() actionLabel = 'Open photo';
  @Output() readonly photoClick = new EventEmitter<Photo>();
  /** The user is about to click a photo (pointer over it, or keyboard focus): a cue to prefetch. */
  @Output() readonly photoIntent = new EventEmitter<Photo>();

  trackById(_index: number, photo: Photo): string {
    return photo.id;
  }
}
