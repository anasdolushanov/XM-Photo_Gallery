import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { Photo } from '../models/photo.model';
import { STORAGE } from '../tokens/storage.token';

export const FAVORITES_STORAGE_KEY = 'photo-library.favorites';

/**
 * Holds the user's favorite photos and persists them to Web Storage,
 * so the list survives a page refresh without any backend.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storage = inject(STORAGE);
  private readonly favoritesSubject = new BehaviorSubject<Photo[]>(this.restore());

  readonly favorites$: Observable<Photo[]> = this.favoritesSubject.asObservable();

  get favorites(): Photo[] {
    return this.favoritesSubject.value;
  }

  isFavorite(id: string): boolean {
    return this.favorites.some(photo => photo.id === id);
  }

  isFavorite$(id: string): Observable<boolean> {
    return this.favorites$.pipe(map(favorites => favorites.some(photo => photo.id === id)));
  }

  getById(id: string): Photo | undefined {
    return this.favorites.find(photo => photo.id === id);
  }

  /** Adds a photo. Returns `false` if it was already a favorite. */
  add(photo: Photo): boolean {
    if (this.isFavorite(photo.id)) {
      return false;
    }
    this.update([...this.favorites, photo]);
    return true;
  }

  /** Removes a photo by id. Returns `false` if it was not a favorite. */
  remove(id: string): boolean {
    if (!this.isFavorite(id)) {
      return false;
    }
    this.update(this.favorites.filter(photo => photo.id !== id));
    return true;
  }

  private update(favorites: Photo[]): void {
    this.favoritesSubject.next(favorites);
    try {
      this.storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage may be full or unavailable (e.g. private mode); keep the in-memory state.
    }
  }

  private restore(): Photo[] {
    try {
      const raw = this.storage.getItem(FAVORITES_STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(isPhoto) : [];
    } catch {
      return [];
    }
  }
}

function isPhoto(value: unknown): value is Photo {
  const candidate = value as Partial<Photo> | null;
  return typeof candidate?.id === 'string' && typeof candidate?.url === 'string';
}
