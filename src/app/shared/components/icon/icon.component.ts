import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type IconName = 'favorite' | 'favorite-outline' | 'delete' | 'check' | 'info' | 'error';

/**
 * Material Design icon paths (24x24 viewBox), inlined so icons render as SVG
 * instead of depending on the "Material Icons" ligature webfont. That font is
 * loaded from Google Fonts at runtime; if the request is blocked or slow, `mat-icon`
 * falls back to showing its raw text content (e.g. "favorite_border") clipped to an
 * icon-sized box. Inline SVG has no such dependency.
 */
const ICON_PATHS: Record<IconName, string> = {
  favorite:
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  'favorite-outline':
    'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z',
  delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  error: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
};

/** Small inline-SVG icon, styled to match its surrounding text color and size. */
@Component({
  selector: 'app-icon',
  template: `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path [attr.d]="path"></path></svg>`,
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;

  get path(): string {
    return ICON_PATHS[this.name];
  }
}
