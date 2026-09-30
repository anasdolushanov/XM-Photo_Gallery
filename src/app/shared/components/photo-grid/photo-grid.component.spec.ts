import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photo } from '../../../core/models/photo.model';
import { SharedModule } from '../../shared.module';
import { PhotoGridComponent } from './photo-grid.component';

describe('PhotoGridComponent', () => {
  const photos: Photo[] = [
    { id: 'a', url: 'https://picsum.photos/seed/a/200/300' },
    { id: 'b', url: 'https://picsum.photos/seed/b/200/300' },
  ];
  let fixture: ComponentFixture<PhotoGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SharedModule] });
    fixture = TestBed.createComponent(PhotoGridComponent);
    fixture.componentRef.setInput('photos', photos);
    fixture.detectChanges();
  });

  function buttons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.grid__button'));
  }

  it('renders a thumbnail per photo', () => {
    const images: HTMLImageElement[] = Array.from(fixture.nativeElement.querySelectorAll('img'));
    expect(images.map(img => img.getAttribute('src'))).toEqual(photos.map(p => p.url));
  });

  it('emits the clicked photo', () => {
    const clicked: Photo[] = [];
    fixture.componentInstance.photoClick.subscribe((photo: Photo) => clicked.push(photo));

    buttons()[1].click();

    expect(clicked).toEqual([photos[1]]);
  });

  it('signals intent when a photo is hovered or focused', () => {
    const intents: Photo[] = [];
    fixture.componentInstance.photoIntent.subscribe((photo: Photo) => intents.push(photo));

    buttons()[0].dispatchEvent(new PointerEvent('pointerenter'));
    buttons()[1].dispatchEvent(new FocusEvent('focus'));

    expect(intents).toEqual(photos);
  });

  it('marks favorite photos with a badge', () => {
    fixture.componentRef.setInput('favoriteIds', new Set(['b']));
    fixture.detectChanges();

    expect(buttons()[0].querySelector('.grid__badge')).toBeNull();
    expect(buttons()[1].querySelector('.grid__badge')).toBeTruthy();
  });

  it('uses the action label for accessibility', () => {
    fixture.componentRef.setInput('actionLabel', 'Add to favorites');
    fixture.detectChanges();

    expect(buttons().every(b => b.getAttribute('aria-label') === 'Add to favorites')).toBeTrue();
  });
});
