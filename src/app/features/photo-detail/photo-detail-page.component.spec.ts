import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

import { MemoryStorage } from '../../../testing/memory-storage';
import { FavoritesService } from '../../core/services/favorites.service';
import { FULL_SIZE_SIZES, PhotoService } from '../../core/services/photo.service';
import { STORAGE } from '../../core/tokens/storage.token';
import { NotificationService } from '../../shared/services/notification.service';
import { SharedModule } from '../../shared/shared.module';
import { PhotoDetailPageComponent } from './photo-detail-page.component';

describe('PhotoDetailPageComponent', () => {
  let fixture: ComponentFixture<PhotoDetailPageComponent>;
  let el: HTMLElement;
  let favorites: FavoritesService;
  let photoService: PhotoService;
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let notifications: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    params = new BehaviorSubject(convertToParamMap({ id: 'abc' }));
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'info', 'error']);
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [PhotoDetailPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: params } },
        { provide: STORAGE, useValue: new MemoryStorage() },
        { provide: NotificationService, useValue: notifications },
      ],
    });
    favorites = TestBed.inject(FavoritesService);
    photoService = TestBed.inject(PhotoService);
    favorites.add({ id: 'abc', url: photoService.getThumbnailUrl('abc') });

    fixture = TestBed.createComponent(PhotoDetailPageComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  function image(): HTMLImageElement {
    return el.querySelector('.detail__image')!;
  }

  function placeholder(): HTMLImageElement {
    return el.querySelector('.detail__placeholder')!;
  }

  /** Simulates the browser finishing (or failing) the full-size image download. */
  function finishImage(event: 'load' | 'error' = 'load'): void {
    image().dispatchEvent(new Event(event));
    fixture.detectChanges();
  }

  function navigateTo(id: string): void {
    params.next(convertToParamMap({ id }));
    fixture.detectChanges();
  }

  it('shows the cached thumbnail and the actions immediately, before the full image loads', () => {
    expect(placeholder().getAttribute('src')).toBe(photoService.getThumbnailUrl('abc'));
    expect(placeholder().classList).toContain('detail__placeholder--blurred');
    expect(image().classList).not.toContain('detail__image--loaded');
    expect(el.querySelector('.detail__remove')).toBeTruthy();
    expect(el.querySelector('.detail__progress')).toBeTruthy();
  });

  it('requests a right-sized full image with the same crop as the thumbnail', () => {
    expect(image().getAttribute('src')).toBe(photoService.getFullSizeUrl('abc'));
    expect(image().getAttribute('srcset')).toBe(photoService.getFullSizeSrcset('abc'));
    expect(image().getAttribute('sizes')).toBe(FULL_SIZE_SIZES);
  });

  it('fades the full image in over the placeholder once loaded', () => {
    finishImage();

    expect(image().classList).toContain('detail__image--loaded');
    expect(placeholder().classList).not.toContain('detail__placeholder--blurred');
    expect(el.querySelector('.detail__progress')).toBeNull();
    expect(el.querySelector('.detail__frame')?.getAttribute('aria-busy')).toBe('false');
  });

  it('keeps showing the unblurred placeholder if the full image fails', () => {
    finishImage('error');

    expect(image().classList).not.toContain('detail__image--loaded');
    expect(placeholder().classList).not.toContain('detail__placeholder--blurred');
    expect(el.querySelector('.detail__progress')).toBeNull();
  });

  it('switches straight to the next photo placeholder on route change', () => {
    finishImage();

    navigateTo('xyz');

    expect(placeholder().getAttribute('src')).toBe(photoService.getThumbnailUrl('xyz'));
    expect(placeholder().classList).toContain('detail__placeholder--blurred');
    expect(image().getAttribute('src')).toBe(photoService.getFullSizeUrl('xyz'));
    expect(image().classList).not.toContain('detail__image--loaded');
  });

  it('removes the photo from favorites and returns to the favorites list', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const button = el.querySelector<HTMLButtonElement>('.detail__remove')!;
    expect(button.textContent).toContain('Remove from favorites');

    button.click();

    expect(favorites.isFavorite('abc')).toBeFalse();
    expect(notifications.info).toHaveBeenCalledWith('Removed from favorites', 'delete');
    expect(navigate).toHaveBeenCalledWith(['/favorites']);
  });

  it('offers to add a photo that is not a favorite', () => {
    navigateTo('other');
    expect(el.querySelector('.detail__remove')).toBeNull();

    el.querySelector<HTMLButtonElement>('.detail__add')!.click();
    fixture.detectChanges();

    expect(favorites.getById('other')).toEqual({ id: 'other', url: photoService.getThumbnailUrl('other') });
    expect(notifications.success).toHaveBeenCalledWith('Added to favorites', 'favorite');
    expect(el.querySelector('.detail__remove')).toBeTruthy();
  });
});
