import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Photo } from '../../core/models/photo.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { PhotoService } from '../../core/services/photo.service';

/** Lists all favorite photos. Clicking one opens its single photo page. */
@Component({
  selector: 'app-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPageComponent {
  private readonly router = inject(Router);
  private readonly photoService = inject(PhotoService);

  readonly favorites$ = inject(FavoritesService).favorites$;

  /** Starts the full-size download on hover/focus, so the single photo page opens with it ready. */
  prefetchPhoto(photo: Photo): void {
    this.photoService.prefetchFullSize(photo.id);
  }

  openPhoto(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }
}
