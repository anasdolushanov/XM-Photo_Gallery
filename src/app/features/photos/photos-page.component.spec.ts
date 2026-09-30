import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { FakeIntersectionObserver } from '../../../testing/fake-intersection-observer';
import { MemoryStorage } from '../../../testing/memory-storage';
import { Photo } from '../../core/models/photo.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { PhotoService } from '../../core/services/photo.service';
import { STORAGE } from '../../core/tokens/storage.token';
import { NotificationService } from '../../shared/services/notification.service';
import { SharedModule } from '../../shared/shared.module';
import { PhotosPageComponent } from './photos-page.component';

function makePhotos(prefix: string, count = 3): Photo[] {
  return Array.from({ length: count }, (_, i) => ({ id: `${prefix}${i}`, url: `https://example.test/${prefix}${i}` }));
}

describe('PhotosPageComponent', () => {
  let fixture: ComponentFixture<PhotosPageComponent>;
  let el: HTMLElement;
  let pendingRequests: Subject<Photo[]>[];
  let favorites: FavoritesService;
  let notifications: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    FakeIntersectionObserver.install();
    pendingRequests = [];
    notifications = jasmine.createSpyObj<NotificationService>('NotificationService', ['success', 'info', 'error']);
    const photoService: Partial<PhotoService> = {
      getRandomPhotos: () => {
        const request = new Subject<Photo[]>();
        pendingRequests.push(request);
        return request;
      },
    };

    TestBed.configureTestingModule({
      imports: [SharedModule, NoopAnimationsModule],
      declarations: [PhotosPageComponent],
      providers: [
        { provide: PhotoService, useValue: photoService },
        { provide: NotificationService, useValue: notifications },
        { provide: STORAGE, useValue: new MemoryStorage() },
      ],
    });
    favorites = TestBed.inject(FavoritesService);

    fixture = TestBed.createComponent(PhotosPageComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => FakeIntersectionObserver.uninstall());

  function respond(photos: Photo[]): void {
    const request = pendingRequests[pendingRequests.length - 1];
    request.next(photos);
    request.complete();
    fixture.detectChanges();
  }

  function images(): HTMLImageElement[] {
    return Array.from(el.querySelectorAll('.grid__image'));
  }

  function scrollToBottom(): void {
    FakeIntersectionObserver.latest().trigger(true);
    fixture.detectChanges();
  }

  it('requests the first page on init and shows the loader', () => {
    expect(pendingRequests.length).toBe(1);
    expect(el.querySelector('app-loader')).toBeTruthy();
  });

  it('renders loaded photos and hides the loader', () => {
    respond(makePhotos('a'));

    expect(images().length).toBe(3);
    expect(el.querySelector('app-loader')).toBeNull();
  });

  it('appends the next page when scrolled to the bottom', () => {
    respond(makePhotos('a'));

    scrollToBottom();
    expect(pendingRequests.length).toBe(2);
    expect(el.querySelector('app-loader')).toBeTruthy();

    respond(makePhotos('b'));
    expect(images().map(img => img.getAttribute('src'))).toEqual([
      ...makePhotos('a').map(p => p.url),
      ...makePhotos('b').map(p => p.url),
    ]);
  });

  it('does not request another page while one is loading', () => {
    scrollToBottom();
    scrollToBottom();

    expect(pendingRequests.length).toBe(1);
  });

  it('reports a failed request and allows loading again', () => {
    pendingRequests[0].error(new Error('network'));
    fixture.detectChanges();

    expect(notifications.error).toHaveBeenCalledWith(jasmine.stringContaining('Could not load'));
    expect(el.querySelector('app-loader')).toBeNull();
    scrollToBottom();
    expect(pendingRequests.length).toBe(2);
  });

  it('adds a clicked photo to favorites and confirms it', () => {
    const photos = makePhotos('a');
    respond(photos);

    el.querySelectorAll<HTMLButtonElement>('.grid__button')[1].click();
    fixture.detectChanges();

    expect(favorites.favorites).toEqual([photos[1]]);
    expect(notifications.success).toHaveBeenCalledWith('Added to favorites', 'favorite');
    expect(el.querySelectorAll('.grid__badge').length).toBe(1);
  });

  it('tells the user when a photo is already a favorite', () => {
    respond(makePhotos('a'));
    const button = el.querySelector<HTMLButtonElement>('.grid__button')!;

    button.click();
    button.click();

    expect(favorites.favorites.length).toBe(1);
    expect(notifications.info).toHaveBeenCalledWith('Already in favorites', 'favorite');
  });
});
