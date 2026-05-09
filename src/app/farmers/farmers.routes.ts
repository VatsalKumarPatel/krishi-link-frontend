import { Routes } from '@angular/router';

export const farmersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./farmers-list/farmers-list.component').then(m => m.FarmersListComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./farmer-detail/farmer-detail.component').then(m => m.FarmerDetailComponent),
  },
];
