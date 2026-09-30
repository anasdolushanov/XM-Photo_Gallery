import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';

import { FavoritesService } from '../../core/services/favorites.service';
import { FULL_SIZE_SIZES, PhotoService } from '../../core/services/photo.service';
import { NotificationService } from '../../shared/services/notification.service';

export interface PhotoDetailViewModel {
  id: string;
  /** Same crop as the grid thumbnail, which the browser already has cached. */
  placeholderUrl: string;
  imageUrl: string;
  imageSrcset: string;
  isFavorite: boolean;
}

type ImageState = 'loaded' | 'error';

/**
 * Single full-screen photo at /photos/:id, with a button to remove it from favorites.
 *
 * The cached thumbnail is shown immediately (blurred) in a frame already sized to the photo,
 * so the right picture and its actions appear together as soon as the page opens. The sharp,
 * right-sized full image then fades in on top once it has downloaded.
 */
@Component({
  selector: 'app-photo-detail-page',
  templateUrl: './photo-detail-page.component.html',
  styleUrls: ['./photo-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailPageComponent {
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly photoService = inject(PhotoService);
  private readonly favoritesService = inject(FavoritesService);

  readonly imageSizes = FULL_SIZE_SIZES;

  readonly vm$: Observable<PhotoDetailViewModel> = inject(ActivatedRoute).paramMap.pipe(
    map(params => params.get('id') ?? ''),
    switchMap(id =>
      this.favoritesService.isFavorite$(id).pipe(
        map(isFavorite => ({
          id,
          isFavorite,
          placeholderUrl: this.photoService.getThumbnailUrl(id),
          imageUrl: this.photoService.getFullSizeUrl(id),
          imageSrcset: this.photoService.getFullSizeSrcset(id),
        })),
      ),
    ),
  );

  /** Outcome of the full image for the photo currently shown; keyed by id so a new photo starts fresh. */
  private imageState: { id: string; state: ImageState } | null = null;

  isImageLoaded(id: string): boolean {
    return this.imageState?.id === id && this.imageState.state === 'loaded';
  }

  /** True once the full image has loaded or failed, i.e. we are no longer waiting on it. */
  isImageSettled(id: string): boolean {
    return this.imageState?.id === id;
  }

  onImageLoad(id: string): void {
    this.imageState = { id, state: 'loaded' };
  }

  /** If the full image fails, keep the sharp-enough placeholder on screen instead of a blank frame. */
  onImageError(id: string): void {
    this.imageState = { id, state: 'error' };
  }

  removeFromFavorites(id: string): void {
    this.favoritesService.remove(id);
    this.notifications.info('Removed from favorites', 'delete');
    this.router.navigate(['/favorites']);
  }

  /** Lets a photo opened via a direct link (not in favorites) be saved. */
  addToFavorites(id: string): void {
    this.favoritesService.add({ id, url: this.photoService.getThumbnailUrl(id) });
    this.notifications.success('Added to favorites', 'favorite');
  }
}
