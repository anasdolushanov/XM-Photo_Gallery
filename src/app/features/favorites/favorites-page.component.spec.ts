import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MemoryStorage } from '../../../testing/memory-storage';
import { Photo } from '../../core/models/photo.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { PhotoService } from '../../core/services/photo.service';
import { STORAGE } from '../../core/tokens/storage.token';
import { SharedModule } from '../../shared/shared.module';
import { FavoritesPageComponent } from './favorites-page.component';

describe('FavoritesPageComponent', () => {
  const photos: Photo[] = [
    { id: 'a', url: 'https://example.test/a' },
    { id: 'b', url: 'https://example.test/b' },
  ];
  let fixture: ComponentFixture<FavoritesPageComponent>;
  let el: HTMLElement;
  let favorites: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [FavoritesPageComponent],
      providers: [{ provide: STORAGE, useValue: new MemoryStorage() }],
    });
    favorites = TestBed.inject(FavoritesService);
    fixture = TestBed.createComponent(FavoritesPageComponent);
    el = fixture.nativeElement;
  });

  it('shows an empty state when there are no favorites', () => {
    fixture.detectChanges();

    expect(el.querySelector('app-photo-grid')).toBeNull();
    expect(el.querySelector('.empty')?.textContent).toContain('No favorites yet');
  });

  it('lists all favorite photos', () => {
    photos.forEach(photo => favorites.add(photo));
    fixture.detectChanges();

    const sources = Array.from(el.querySelectorAll('.grid__image')).map(img => img.getAttribute('src'));
    expect(sources).toEqual(photos.map(p => p.url));
  });

  it('updates when favorites change', () => {
    favorites.add(photos[0]);
    fixture.detectChanges();
    favorites.remove('a');
    fixture.detectChanges();

    expect(el.querySelector('.empty')).toBeTruthy();
  });

  it('prefetches the full-size photo when the user hovers a favorite', () => {
    const prefetch = spyOn(TestBed.inject(PhotoService), 'prefetchFullSize');
    photos.forEach(photo => favorites.add(photo));
    fixture.detectChanges();

    el.querySelectorAll<HTMLButtonElement>('.grid__button')[1].dispatchEvent(new PointerEvent('pointerenter'));

    expect(prefetch).toHaveBeenCalledWith('b');
  });

  it('opens the single photo page when a photo is clicked', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    photos.forEach(photo => favorites.add(photo));
    fixture.detectChanges();

    el.querySelectorAll<HTMLButtonElement>('.grid__button')[1].click();

    expect(navigate).toHaveBeenCalledWith(['/photos', 'b']);
  });
});
