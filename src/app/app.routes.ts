import { Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./client/client-layout.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./client/pages/home/home.component')
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./client/pages/nosotros/nosotros.component')
      },
      {
        path: 'flota',
        loadComponent: () => import('./client/pages/flota/flota.component')
      },
      {
        path: 'servicio',
        loadComponent: () => import('./client/pages/servicio/servicio.component')
      },
      {
        path: 'empresas',
        loadComponent: () => import('./client/pages/empresas/empresas.component')
      },
      {
        path: 'contacto',
        loadComponent: () => import('./client/pages/contacto/contacto.component')
      },
      {
        path: 'checkout',
        loadComponent: () => import('./client/pages/checkout/checkout.component')
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component'),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/layout.component'),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/pages/home/home.component')
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./admin/pages/usuarios/usuarios/usuarios.component')
      },
      {
        path: 'agregar-usuario',
        loadComponent: () => import('./admin/pages/usuarios/agregar-usuario/agregar-usuario.component')
      },
    ]
  }
];
