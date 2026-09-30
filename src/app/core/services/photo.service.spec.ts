import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Photo } from '../models/photo.model';
import { DEFAULT_PAGE_SIZE, FULL_SIZE_SIZES, MAX_DELAY_MS, MIN_DELAY_MS, PhotoService } from './photo.service';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoService);
  });

  it('returns a page of photos with the default size', fakeAsync(() => {
    let result: Photo[] | undefined;
    service.getRandomPhotos().subscribe(photos => (result = photos));
    tick(MAX_DELAY_MS);

    expect(result?.length).toBe(DEFAULT_PAGE_SIZE);
  }));

  it('returns the requested number of photos with unique ids and thumbnail urls', fakeAsync(() => {
    let result: Photo[] = [];
    service.getRandomPhotos(5).subscribe(photos => (result = photos));
    tick(MAX_DELAY_MS);

    expect(result.length).toBe(5);
    expect(new Set(result.map(p => p.id)).size).toBe(5);
    result.forEach(photo => expect(photo.url).toBe(service.getThumbnailUrl(photo.id)));
  }));

  it('never responds faster than the minimum delay', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0);
    let emitted = false;
    service.getRandomPhotos(1).subscribe(() => (emitted = true));

    tick(MIN_DELAY_MS - 1);
    expect(emitted).toBeFalse();
    tick(1);
    expect(emitted).toBeTrue();
  }));

  it('always responds within the maximum delay', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0.9999);
    let emitted = false;
    service.getRandomPhotos(1).subscribe(() => (emitted = true));

    tick(MAX_DELAY_MS - 1);
    expect(emitted).toBeFalse();
    tick(1);
    expect(emitted).toBeTrue();
  }));

  it('does nothing until subscribed', () => {
    const randomSpy = spyOn(Math, 'random').and.callThrough();
    service.getRandomPhotos();
    expect(randomSpy).not.toHaveBeenCalled();
  });

  it('builds picsum urls from the photo id', () => {
    expect(service.getThumbnailUrl('abc')).toBe('https://picsum.photos/seed/abc/200/300');
    expect(service.getFullSizeUrl('abc')).toBe('https://picsum.photos/seed/abc/600/900');
  });

  it('offers full-size variants with the same 2:3 crop as the thumbnail', () => {
    expect(service.getFullSizeSrcset('abc')).toBe(
      'https://picsum.photos/seed/abc/600/900 600w, https://picsum.photos/seed/abc/1000/1500 1000w',
    );
  });

  describe('prefetchFullSize', () => {
    let created: Partial<HTMLImageElement>[];

    beforeEach(() => {
      created = [];
      // Hand back a plain object so the test never starts a real download.
      spyOn(document, 'createElement').and.callFake(() => {
        const image: Partial<HTMLImageElement> = {};
        created.push(image);
        return image as HTMLElement;
      });
    });

    it('requests the same variant the single photo page will pick', () => {
      service.prefetchFullSize('abc');

      expect(created.length).toBe(1);
      expect(created[0].srcset).toBe(service.getFullSizeSrcset('abc'));
      expect(created[0].sizes).toBe(FULL_SIZE_SIZES);
      expect(created[0].src).toBe(service.getFullSizeUrl('abc'));
    });

    it('prefetches each photo only once', () => {
      service.prefetchFullSize('abc');
      service.prefetchFullSize('abc');
      service.prefetchFullSize('xyz');

      expect(created.length).toBe(2);
    });
  });
});
