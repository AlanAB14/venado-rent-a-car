import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./client/client-layout.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./client/pages/home/home.component')
      }
    ]
  }
];
