import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { FavoritesPageComponent } from './favorites-page.component';

@NgModule({
  declarations: [FavoritesPageComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: FavoritesPageComponent }])],
})
export class FavoritesModule {}
