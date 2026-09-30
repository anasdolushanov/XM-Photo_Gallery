import { ChangeDetectionStrategy, Component } from '@angular/core';

interface NavLink {
  label: string;
  path: string;
  exact: boolean;
}

/** App header with navigation between the photo stream and the favorites library. */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly links: NavLink[] = [
    { label: 'Photos', path: '/', exact: true },
    { label: 'Favorites', path: '/favorites', exact: false },
  ];
}
