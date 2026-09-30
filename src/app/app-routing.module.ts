import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Photos',
    loadChildren: () => import('./features/photos/photos.module').then(m => m.PhotosModule),
  },
  {
    path: 'favorites',
    title: 'Favorites',
    loadChildren: () => import('./features/favorites/favorites.module').then(m => m.FavoritesModule),
  },
  {
    path: 'photos/:id',
    title: 'Photo',
    loadChildren: () => import('./features/photo-detail/photo-detail.module').then(m => m.PhotoDetailModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
