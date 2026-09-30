import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, finalize, map } from 'rxjs';

import { Photo } from '../../core/models/photo.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { PhotoService } from '../../core/services/photo.service';
import { NotificationService } from '../../shared/services/notification.service';

/** Infinite random photo stream. Clicking a photo adds it to favorites. */
@Component({
  selector: 'app-photos-page',
  templateUrl: './photos-page.component.html',
  styleUrls: ['./photos-page.component.scss'],
})
export class PhotosPageComponent implements OnInit {
  private readonly photoService = inject(PhotoService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly emptyIds: ReadonlySet<string> = new Set();
  photos: Photo[] = [];
  loading = false;

  readonly favoriteIds$: Observable<ReadonlySet<string>> = this.favoritesService.favorites$.pipe(
    map(favorites => new Set(favorites.map(photo => photo.id))),
  );

  ngOnInit(): void {
    this.loadMore();
  }

  loadMore(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.photoService
      .getRandomPhotos()
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: photos => (this.photos = [...this.photos, ...photos]),
        error: () => this.notifications.error('Could not load photos. Scroll to try again.'),
      });
  }

  addToFavorites(photo: Photo): void {
    if (this.favoritesService.add(photo)) {
      this.notifications.success('Added to favorites', 'favorite');
    } else {
      this.notifications.info('Already in favorites', 'favorite');
    }
  }
}
