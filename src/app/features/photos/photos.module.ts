import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { PhotosPageComponent } from './photos-page.component';

@NgModule({
  declarations: [PhotosPageComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: PhotosPageComponent }])],
})
export class PhotosModule {}
