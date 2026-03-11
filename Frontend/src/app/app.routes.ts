import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard-page/dashboard-page.component').then(c => c.DashboardPageComponent)
  },
  {
    path: 'devices',
    loadComponent: () => import('./pages/devices/devices-page.component').then(c => c.DevicesPageComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
