import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'prestamos',
        loadComponent: () => import('./pages/prestamos/prestamos.page').then(m => m.PrestamosPage)
      },
      {
        path: 'disponibilidad',
        loadComponent: () => import('./pages/disponibilidad/disponibilidad.page').then(m => m.DisponibilidadPage)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage)
      },
      {
        path: '',
        redirectTo: 'prestamos',
        pathMatch: 'full'
      }
    ]
  }
];

