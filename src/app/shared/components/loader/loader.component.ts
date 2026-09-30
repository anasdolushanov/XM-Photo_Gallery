import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Spinner with a caption, shown while data is loading. */
@Component({
  selector: 'app-loader',
  template: `
    <div class="loader" role="status" aria-live="polite">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <span class="loader__label">{{ label }}</span>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  @Input() label = 'Loading...';
  @Input() diameter = 48;
}
