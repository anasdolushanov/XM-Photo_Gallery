import { Component } from '@angular/core';

/**
 * Application shell: shared header plus the routed page.
 * Uses default change detection so routed pages updated by async events are always checked.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
