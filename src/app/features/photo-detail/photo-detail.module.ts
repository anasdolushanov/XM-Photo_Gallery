import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { PhotoDetailPageComponent } from './photo-detail-page.component';

@NgModule({
  declarations: [PhotoDetailPageComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: PhotoDetailPageComponent }])],
})
export class PhotoDetailModule {}
