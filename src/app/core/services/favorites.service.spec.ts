import { TestBed } from '@angular/core/testing';

import { Photo } from '../models/photo.model';
import { STORAGE } from '../tokens/storage.token';
import { MemoryStorage } from '../../../testing/memory-storage';
import { FAVORITES_STORAGE_KEY, FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  const photoA: Photo = { id: 'a', url: 'https://picsum.photos/seed/a/200/300' };
  const photoB: Photo = { id: 'b', url: 'https://picsum.photos/seed/b/200/300' };
  let storage: MemoryStorage;

  function createService(): FavoritesService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: STORAGE, useValue: storage }] });
    return TestBed.inject(FavoritesService);
  }

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it('starts empty when nothing is stored', () => {
    expect(createService().favorites).toEqual([]);
  });

  it('adds a photo and emits the new list', () => {
    const service = createService();
    const emissions: Photo[][] = [];
    service.favorites$.subscribe(list => emissions.push(list));

    expect(service.add(photoA)).toBeTrue();
    expect(service.favorites).toEqual([photoA]);
    expect(service.isFavorite('a')).toBeTrue();
    expect(emissions).toEqual([[], [photoA]]);
  });

  it('does not add the same photo twice', () => {
    const service = createService();
    service.add(photoA);

    expect(service.add(photoA)).toBeFalse();
    expect(service.favorites).toEqual([photoA]);
  });

  it('removes a photo by id', () => {
    const service = createService();
    service.add(photoA);
    service.add(photoB);

    expect(service.remove('a')).toBeTrue();
    expect(service.favorites).toEqual([photoB]);
    expect(service.remove('a')).toBeFalse();
  });

  it('looks up a favorite by id', () => {
    const service = createService();
    service.add(photoA);

    expect(service.getById('a')).toEqual(photoA);
    expect(service.getById('missing')).toBeUndefined();
  });

  it('exposes favorite status as a stream', () => {
    const service = createService();
    const states: boolean[] = [];
    service.isFavorite$('a').subscribe(state => states.push(state));

    service.add(photoA);
    service.remove('a');

    expect(states).toEqual([false, true, false]);
  });

  it('persists favorites so they survive a reload', () => {
    createService().add(photoA);
    expect(JSON.parse(storage.getItem(FAVORITES_STORAGE_KEY)!)).toEqual([photoA]);

    expect(createService().favorites).toEqual([photoA]);
  });

  it('ignores corrupted storage data', () => {
    storage.setItem(FAVORITES_STORAGE_KEY, '{not json');
    expect(createService().favorites).toEqual([]);
  });

  it('drops malformed entries from storage', () => {
    storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([photoA, { id: 1 }, null, 'x']));
    expect(createService().favorites).toEqual([photoA]);
  });

  it('keeps working in memory when storage writes fail', () => {
    spyOn(storage, 'setItem').and.throwError('QuotaExceededError');
    const service = createService();

    expect(service.add(photoA)).toBeTrue();
    expect(service.favorites).toEqual([photoA]);
  });
});
