import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderComponent } from './components/header/header.component';
import { IconComponent } from './components/icon/icon.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PhotoGridComponent } from './components/photo-grid/photo-grid.component';
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';

const MATERIAL_MODULES = [MatButtonModule, MatProgressSpinnerModule, MatSnackBarModule, MatToolbarModule];
const DECLARATIONS = [
  HeaderComponent,
  IconComponent,
  LoaderComponent,
  NotificationComponent,
  PhotoGridComponent,
  InfiniteScrollDirective,
];

/** Reusable UI building blocks and the Material modules the features rely on. */
@NgModule({
  declarations: DECLARATIONS,
  imports: [CommonModule, RouterModule, ...MATERIAL_MODULES],
  exports: [CommonModule, ...MATERIAL_MODULES, ...DECLARATIONS],
})
export class SharedModule {}
